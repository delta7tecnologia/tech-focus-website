import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { DELTA7_LOGO_DARK_SMALL, DELTA7_LOGO_WHITE_SMALL } from '@/assets/delta7LogoSmallBase64';
import { DELL_EXPERT_LOGO_SQUARE_DATA_URL } from '@/assets/dellExpertLogoSquareBase64';
import { formatBRL, SUP_DEFAULT_SECTIONS, normalizeItSupportContent, type SupProposalSections, type ItSupportCustomContent } from '@/lib/itSupportContent';
import type { FeaturedClientPdf } from './proposalClientsBlock';
import { needsProposalPage, PROPOSAL_PAGE_TOP as TOP, PROPOSAL_PAGE_BOTTOM as BOTTOM } from './proposalPageLayout';

export interface SupProposalItem { description: string; qty: number; unit_price: number; unit_label?: string }
export interface ItSupportProposalPdfData {
  proposalNumber: string; generatedAt: string; validityDays: number; contractMonths: number;
  clientName: string; clientDocument?: string; clientContact?: string; clientEmail?: string; clientAddress?: string;
  salesRepName: string; salesRepEmail?: string; items: SupProposalItem[]; setupFee: number; discount: number; notes?: string;
  integrityHash: string; validationUrl?: string; qrCodeDataUrl?: string; sections?: SupProposalSections;
  template?: 'modelo01' | 'modelo02'; showAltatekLogo?: boolean; featuredClients?: FeaturedClientPdf[]; customContent?: ItSupportCustomContent;
}
export type ProposalTemplate = 'modelo01' | 'modelo02';
// Same native A4 presentation as the server rental proposal.
const NAVY: [number, number, number] = [10,31,68];
const ORANGE: [number, number, number] = [232,119,34];
const WHITE: [number, number, number] = [255,255,255];
const INK: [number, number, number] = [26,37,64];
const MUTED: [number, number, number] = [100,116,139];
const LIGHT: [number, number, number] = [241,245,249];
const ML=18, CW=174;
const date=(value:string)=>new Date(value).toLocaleDateString('pt-BR');

async function imageData(url:string): Promise<string | null> {
  try {
    const response=await fetch(url);
    if (!response.ok) return null;
    const blob=await response.blob();
    return await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(typeof reader.result==='string'?reader.result:null);reader.onerror=()=>resolve(null);reader.readAsDataURL(blob);});
  } catch { return null; }
}

async function buildPdf(r:ItSupportProposalPdfData):Promise<jsPDF> {
  const d=new jsPDF({unit:'mm',format:'a4'});
  const content=normalizeItSupportContent(r.customContent);
  const S={...SUP_DEFAULT_SECTIONS,...r.sections};
  let y=TOP;
  const text=(s:string,x:number,at:number,size=9,color=INK,bold=false,align:'left'|'right'|'center'='left')=>{
    d.setFont('helvetica',bold?'bold':'normal');d.setFontSize(size);d.setTextColor(...color);d.text(s,x,at,{align});
  };
  const rect=(x:number,at:number,w:number,h:number,color:[number,number,number])=>{d.setFillColor(...color);d.rect(x,at,w,h,'F');};
  const lines=(s:string,width=CW,size=9,bold=false):string[]=>{
    d.setFont('helvetica',bold?'bold':'normal');d.setFontSize(size);return d.splitTextToSize(s,width);
  };
  const header=()=>{
    d.addImage(DELTA7_LOGO_DARK_SMALL,'JPEG',ML,7,30,9);
    text('Suporte de TI',ML+CW,12,8,MUTED,false,'right');text(r.proposalNumber,ML+CW,17,9,NAVY,true,'right');
    d.setDrawColor(...ORANGE);d.line(ML,21,ML+CW,21);
  };
  const newPage=()=>{d.addPage();header();y=TOP;};
  const ensure=(height:number)=>{if(needsProposalPage(y,height))newPage();};
  const paragraph=(value:string,width=CW,x=ML,size=9,color=INK,bold=false)=>{
    for(const line of lines(value,width,size,bold)){ensure(5);text(line,x,y,size,color,bold);y+=4.5;}y+=3;
  };
  const title=(label:string)=>{
    const wrapped=lines(label.toUpperCase(),CW,13,true);ensure(wrapped.length*6+20);
    wrapped.forEach(line=>{text(line,ML,y,13,NAVY,true);y+=6;});rect(ML,y-2,18,1,ORANGE);y+=6;
  };
  const pair=(label:string,value:string,index=0)=>{
    const wrapped=lines(value,CW-39,9);const h=Math.max(9,wrapped.length*4.5+4);ensure(h);
    rect(ML,y,CW,h,index%2?WHITE:LIGHT);text(label,ML+2,y+5.5,8,NAVY,true);
    wrapped.forEach((line,i)=>text(line,ML+38,y+5.5+i*4.5));y+=h;
  };
  const entry=(label:string,value:string)=>{const count=lines(label,CW,9,true).length+lines(value).length;ensure(Math.min(16+count*4.5,80));paragraph(label,CW,ML,9,NAVY,true);paragraph(value);y+=2;};

  rect(0,0,210,297,NAVY);d.addImage(DELTA7_LOGO_WHITE_SMALL,'JPEG',ML,14,38,12);
  if(r.showAltatekLogo){try{d.addImage(DELL_EXPERT_LOGO_SQUARE_DATA_URL,'PNG',174,14,18,18);}catch{}}
  rect(ML,78,22,1.5,ORANGE);text('PROPOSTA COMERCIAL',ML,91,9,MUTED);
  text('SUPORTE',ML,119,39,WHITE,true);text('de TI.',ML,139,31,ORANGE,true);
  lines('Seu departamento de TI terceirizado, com SLA e gente de verdade.',130,12).forEach((line,i)=>text(line,ML,158+i*6,12,WHITE));
  text(`CONTRATO DE ${r.contractMonths} MESES`,ML,184,11,WHITE,true);
  text('PREPARADO PARA',ML,241,7,MUTED);
  lines(r.clientName,CW,13,true).slice(0,4).forEach((line,i)=>text(line,ML,249+i*6,13,WHITE,true));
  text(`${r.proposalNumber} · ${date(r.generatedAt)} · Validade ${r.validityDays} dias`,ML,279,9,WHITE);

  newPage();title('Identificação e solução');
  [['Cliente',r.clientName],['Documento',r.clientDocument||'—'],['Contato',r.clientContact||'—'],['E-mail',r.clientEmail||'—'],['Endereço',r.clientAddress||'—'],['Executivo',r.salesRepName],['E-mail executivo',r.salesRepEmail||'—']].forEach(([l,v],i)=>pair(l,v,i));y+=9;
  if(S.showAbout){title('Sobre a Delta7 Tecnologia');paragraph(content.about);content.kpis.forEach(k=>entry(k.value,k.label));}
  if(S.showBenefits){title('Por que terceirizar TI');content.benefits.forEach(b=>entry(b.title,b.text));}
  if(S.showInfra){title('Stack monitorada');content.infrastructure.forEach(b=>entry(b.title,b.text));}
  if(S.showSla){title('SLA por prioridade');content.sla.forEach(s=>entry(`${s.priority} · ${s.response}`,s.description));}
  if(S.showIdealFor){title('Perfil ideal');content.idealFor.forEach(b=>entry(b.title,b.text));}
  if(S.showClients && r.featuredClients?.length){
    ensure(Math.min(24+Math.ceil(r.featuredClients.length/4)*25,200));
    title('Clientes que confiam na Delta7');
    const clients=await Promise.all(r.featuredClients.map(async c=>({...c,image:c.logo_url?await imageData(c.logo_url):null})));
    for(let offset=0;offset<clients.length;offset+=4){ensure(28);const at=y;
      clients.slice(offset,offset+4).forEach((c,i)=>{const x=ML+i*44;
        if(c.image){try{const props=d.getImageProperties(c.image);const ratio=Math.min(38/props.width,12/props.height);const w=props.width*ratio,h=props.height*ratio;d.addImage(c.image,x+(40-w)/2,at,w,h);}catch{}}
        lines(c.name,40,8,true).slice(0,3).forEach((line,j)=>text(line,x+20,at+17+j*3.5,8,NAVY,true,'center'));
      });y+=25;
    }
  }

  newPage();title('Escopo e investimento');
  const tableHeader=()=>{rect(ML,y,CW,9,NAVY);text('ITEM',ML+3,y+6,8,WHITE,true);text('QTD',126,y+6,8,WHITE,true,'right');text('UNIT.',155,y+6,8,WHITE,true,'right');text('SUBTOTAL',189,y+6,8,WHITE,true,'right');y+=9;};
  tableHeader();
  r.items.filter(i=>i.qty>0).forEach((item,index)=>{
    const wrapped=lines(item.description+(item.unit_label?` / ${item.unit_label}`:''),95,9);
    const rowHeight=Math.max(10,wrapped.length*4.5+4);
    if(rowHeight<=BOTTOM-TOP-9 && needsProposalPage(y,rowHeight)){newPage();tableHeader();}
    let offset=0;
    while(offset<wrapped.length){
      if(y+10>BOTTOM){newPage();tableHeader();}
      const count=Math.max(1,Math.min(wrapped.length-offset,Math.floor((BOTTOM-y-4)/4.5)));
      const h=Math.max(10,count*4.5+4);rect(ML,y,CW,h,index%2?WHITE:LIGHT);
      wrapped.slice(offset,offset+count).forEach((line,j)=>text(line,ML+3,y+5.5+j*4.5));
      if(offset===0){text(String(item.qty),126,y+5.5,9,INK,false,'right');text(formatBRL(item.unit_price),155,y+5.5,9,INK,false,'right');text(formatBRL(item.qty*item.unit_price),189,y+5.5,9,NAVY,true,'right');}
      y+=h;offset+=count;
    }
  });
  const subtotal=r.items.reduce((sum,i)=>sum+(Number(i.qty)||0)*(Number(i.unit_price)||0),0);
  const monthly=subtotal-(Number(r.discount)||0),setup=Number(r.setupFee)||0;
  ensure(65);y+=5;pair('Subtotal mensal',formatBRL(subtotal));if(r.discount>0)pair('Desconto mensal',`- ${formatBRL(r.discount)}`);
  rect(ML,y,CW,11,NAVY);text('TOTAL MENSAL',ML+3,y+7,9,WHITE,true);text(formatBRL(monthly),189,y+7,12,ORANGE,true,'right');y+=17;
  if(setup>0)pair('Setup inicial',formatBRL(setup));pair('Investimento no 1º mês',formatBRL(monthly+setup));pair(`Total em ${r.contractMonths} meses`,formatBRL(monthly*r.contractMonths+setup));y+=10;
  title('Não inclusos');paragraph(content.notIncluded);if(r.notes){title('Observações');paragraph(r.notes);}

  newPage();title('Condições contratuais');paragraph(content.contractText);
  if(S.showSupportReqs){title('Condições e horários');content.requirements.forEach(value=>paragraph(`• ${value}`));}
  if(S.showQuote){ensure(Math.min(lines(content.quote.text).length*4.5+15,80));paragraph(content.quote.text,CW,ML,9,MUTED);paragraph(content.quote.author,CW,ML,8,NAVY,true);}
  ensure(120);title('Aceite');paragraph(`Declaro estar de acordo com os termos, valores e condições apresentados nesta proposta de Suporte de TI, emitida em ${date(r.generatedAt)} com validade de ${r.validityDays} dias e vigência de ${r.contractMonths} meses.`);
  ensure(45);y+=14;d.setDrawColor(...NAVY);d.line(ML,y,ML+70,y);d.line(ML+CW-70,y,ML+CW,y);
  lines(r.clientName,70,8,true).forEach((line,i)=>text(line,ML+35,y+6+i*4,8,NAVY,true,'center'));
  text('DELTA7 TECNOLOGIA',ML+CW-35,y+6,8,NAVY,true,'center');text(r.salesRepName,ML+CW-35,y+11,8,MUTED,false,'center');y+=29;
  const validationUrl=r.validationUrl||`${window.location.origin}/validar-suporte/${r.integrityHash}`;
  ensure(38);
  try{const qr=r.qrCodeDataUrl||await QRCode.toDataURL(validationUrl,{margin:1,width:220});d.addImage(qr,'PNG',ML,y,26,26);}catch{}
  const qrY=y;y+=4;paragraph('VALIDAR AUTENTICIDADE',CW-33,ML+33,8,NAVY,true);paragraph(validationUrl,CW-33,ML+33,7,MUTED);y=Math.max(y,qrY+29);
  const total=d.getNumberOfPages();for(let page=2;page<=total;page++){d.setPage(page);text(`Integridade SHA-256: ${r.integrityHash}`,ML,287,6,MUTED);text(`${page} / ${total}`,ML+CW,287,7,MUTED,false,'right');}
  return d;
}

export async function downloadItSupportProposalPdf(data:ItSupportProposalPdfData){
  const pdf=await buildPdf(data);const suffix=data.template==='modelo02'?'_Modelo02':'';
  pdf.save(`Proposta_Suporte_${data.proposalNumber}${suffix}.pdf`);
}
export async function previewItSupportProposalPdf(data:ItSupportProposalPdfData):Promise<string[]>{
  const pdf=await buildPdf(data);return [pdf.output('datauristring')];
}
