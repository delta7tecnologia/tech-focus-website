import { useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number | null;
  total: number;
  payment_status: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
}

interface OrderPdfGeneratorProps {
  order: Order;
  onClose: () => void;
}

const OrderPdfGenerator = ({ order, onClose }: OrderPdfGeneratorProps) => {
  useEffect(() => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pedido #${order.id.slice(0, 8).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', sans-serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto;
            color: #333;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 2px solid #f97316; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .logo { font-size: 24px; font-weight: bold; color: #f97316; }
          .order-id { 
            text-align: right;
          }
          .order-id h2 { font-size: 14px; color: #666; }
          .order-id p { font-size: 20px; font-weight: bold; font-family: monospace; }
          .section { margin-bottom: 25px; }
          .section-title { 
            font-size: 14px; 
            text-transform: uppercase; 
            color: #666; 
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px;
          }
          .info-item label { 
            font-size: 12px; 
            color: #999; 
            display: block;
            margin-bottom: 2px;
          }
          .info-item span { font-size: 14px; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
          }
          th { 
            background: #f5f5f5; 
            text-align: left; 
            padding: 12px; 
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
          }
          td { 
            padding: 12px; 
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .totals { 
            margin-top: 20px; 
            text-align: right;
          }
          .totals-row { 
            display: flex; 
            justify-content: flex-end; 
            gap: 50px;
            padding: 5px 0;
          }
          .totals-row.total { 
            font-size: 18px; 
            font-weight: bold;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
          }
          .discount { color: #22c55e; }
          .status { 
            display: inline-block;
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px;
            font-weight: 500;
          }
          .status-paid { background: #dcfce7; color: #16a34a; }
          .status-pending { background: #fef3c7; color: #d97706; }
          .status-cancelled { background: #fee2e2; color: #dc2626; }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            color: #999; 
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .notes { 
            background: #f9fafb; 
            padding: 15px; 
            border-radius: 8px;
            font-size: 14px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TechFocus</div>
          <div class="order-id">
            <h2>Pedido</h2>
            <p>#${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Informações do Cliente</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nome</label>
              <span>${order.customer_name}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>${order.customer_email}</span>
            </div>
            <div class="info-item">
              <label>Data do Pedido</label>
              <span>${format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
            <div class="info-item">
              <label>Status</label>
              <span class="status status-${order.payment_status}">
                ${order.payment_status === 'paid' ? 'Pago' : 
                  order.payment_status === 'pending' ? 'Pendente' : 
                  order.payment_status === 'cancelled' ? 'Cancelado' : order.payment_status}
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Produtos</h3>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th style="text-align: right">Preço Unit.</th>
                <th style="text-align: right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right">R$ ${item.price.toFixed(2)}</td>
                  <td style="text-align: right">R$ ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>R$ ${order.subtotal.toFixed(2)}</span>
            </div>
            ${order.discount && order.discount > 0 ? `
              <div class="totals-row discount">
                <span>Desconto:</span>
                <span>- R$ ${order.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="totals-row total">
              <span>Total:</span>
              <span>R$ ${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${order.notes ? `
          <div class="section">
            <h3 class="section-title">Observações</h3>
            <div class="notes">${order.notes}</div>
          </div>
        ` : ''}

        <div class="footer">
          <p>Documento gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p>Este documento é um comprovante de sua compra.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        onClose();
      }, 250);
    }
  }, [order, onClose]);

  return null;
};

export default OrderPdfGenerator;
