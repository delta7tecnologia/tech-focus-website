-- 1. Novas colunas
ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS os_seq bigint,
  ADD COLUMN IF NOT EXISTS audit_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false;

-- 2. Sequence para numeração estável
CREATE SEQUENCE IF NOT EXISTS public.service_orders_seq START 1;

-- 3. Trigger para preencher os_seq antes do insert
CREATE OR REPLACE FUNCTION public.service_orders_set_seq()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.os_seq IS NULL THEN
    NEW.os_seq := nextval('public.service_orders_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_service_orders_set_seq ON public.service_orders;
CREATE TRIGGER trg_service_orders_set_seq
  BEFORE INSERT ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.service_orders_set_seq();

-- 4. Trigger para travar a OS quando finalizar e registrar reaberturas
CREATE OR REPLACE FUNCTION public.service_orders_lock_on_finalize()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  entry jsonb;
BEGIN
  -- Finalização: rascunho -> emitido
  IF OLD.is_draft = true AND NEW.is_draft = false THEN
    NEW.locked := true;
    entry := jsonb_build_object(
      'event', 'finalized',
      'at', now(),
      'by', auth.uid()
    );
    NEW.audit_log := COALESCE(OLD.audit_log, '[]'::jsonb) || entry;
  END IF;

  -- Reabertura por admin: emitido -> rascunho
  IF OLD.is_draft = false AND NEW.is_draft = true THEN
    entry := jsonb_build_object(
      'event', 'reopened',
      'at', now(),
      'by', auth.uid()
    );
    NEW.audit_log := COALESCE(OLD.audit_log, '[]'::jsonb) || entry;
    NEW.locked := false;
  END IF;

  -- Edição enquanto travada (admin destravou ou bypass): registra
  IF OLD.locked = true AND NEW.locked = true AND OLD.is_draft = false AND NEW.is_draft = false THEN
    -- Detecta mudança de conteúdo significativa (hash mudou)
    IF OLD.integrity_hash IS DISTINCT FROM NEW.integrity_hash THEN
      entry := jsonb_build_object(
        'event', 'edited_after_emission',
        'at', now(),
        'by', auth.uid(),
        'old_hash', OLD.integrity_hash,
        'new_hash', NEW.integrity_hash
      );
      NEW.audit_log := COALESCE(OLD.audit_log, '[]'::jsonb) || entry;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_service_orders_lock ON public.service_orders;
CREATE TRIGGER trg_service_orders_lock
  BEFORE UPDATE ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.service_orders_lock_on_finalize();

-- 5. Política pública por hash (validação via QR Code)
DROP POLICY IF EXISTS "Public can view SO by integrity hash" ON public.service_orders;
CREATE POLICY "Public can view SO by integrity hash"
  ON public.service_orders
  FOR SELECT
  TO anon, authenticated
  USING (integrity_hash IS NOT NULL);

-- 6. Restringe UPDATE quando locked=true (apenas admins podem editar OS travada)
DROP POLICY IF EXISTS "Owners or editors can update service orders" ON public.service_orders;
CREATE POLICY "Owners or editors can update service orders"
  ON public.service_orders
  FOR UPDATE
  TO authenticated
  USING (
    (locked = false AND (
      ((created_by = auth.uid()) AND EXISTS (
        SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
      ))
      OR EXISTS (
        SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true
      )
    ))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    (locked = false AND (
      ((created_by = auth.uid()) AND EXISTS (
        SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
      ))
      OR EXISTS (
        SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true
      )
    ))
    OR has_role(auth.uid(), 'admin'::app_role)
  );
