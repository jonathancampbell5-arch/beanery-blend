'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee as CoffeeIcon, ShoppingCart, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SHOPIFY_STORE_URL = "https://beaneryblend-demo.myshopify.com";
const SHOPIFY_DEMO_PRODUCT = "beanery-blend-demo";

const PAYFAST_SANDBOX = true;
const PAYFAST_ENDPOINT = PAYFAST_SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";
const PAYFAST_DEMO = {
  merchant_id: "10000100",
  merchant_key: "46f0cd694581a",
  return_url: "https://beaneryblend.co.za/return",
  cancel_url: "https://beaneryblend.co.za/cancel",
  notify_url: "https://beaneryblend.co.za/payfast/ipn",
};

const BANK_DETAILS = {
  bank: "ABSA BANK",
  accountName: "Beanery Blend (Pty) Ltd",
  accountNumber: "4115496655",
  branchCode: "632005",
  emailPOP: "beaneryblend@gmail.com",
  accountType: "Cheque",
};

function submitPayfastPayment({ amount, item_name, item_description }:{amount:string,item_name:string,item_description:string}) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = PAYFAST_ENDPOINT;
  const fields:any = {
    merchant_id: PAYFAST_DEMO.merchant_id,
    merchant_key: PAYFAST_DEMO.merchant_key,
    return_url: PAYFAST_DEMO.return_url,
    cancel_url: PAYFAST_DEMO.cancel_url,
    notify_url: PAYFAST_DEMO.notify_url,
    amount: Number(amount).toFixed(2),
    item_name,
    item_description,
  };
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    (input as any).name = name;
    (input as any).value = String(value);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

function QRPayModal({ open, onClose, payloadText, amount, reference }:{open:boolean,onClose:()=>void,payloadText:string,amount:string,reference:string}) {
  const [dataUrl, setDataUrl] = useState("");
  useEffect(() => {
    let mounted = true;
    async function gen() {
      if (!open) return;
      try {
        const { toDataURL } = await import("qrcode");
        const url = await toDataURL(payloadText, { width: 512, margin: 1 });
        if (mounted) setDataUrl(url);
      } catch (e) { console.error("QR generation failed", e); }
    }
    gen();
    return () => { mounted = false; };
  }, [open, payloadText]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">Scan to pay (EFT)</h3>
            <p className="text-sm text-neutral-500">Amount: R{amount} • Ref: {reference}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center gap-4">
          {dataUrl ? <img src={dataUrl} alt="Scan to pay" className="w-64 h-64"/> : <div className="w-64 h-64 animate-pulse bg-neutral-100 rounded-xl"/>}
          <div className="text-xs text-center text-neutral-500">
            If your banking app supports QR payments, scanning may prefill details. Otherwise use the details below with your order number as reference.
          </div>
          <div className="w-full text-xs rounded-xl bg-neutral-50 p-3 border">
            <div><strong>Account:</strong> {BANK_DETAILS.accountName}</div>
            <div><strong>Bank:</strong> {BANK_DETAILS.bank}</div>
            <div><strong>Account no:</strong> {BANK_DETAILS.accountNumber}</div>
            <div><strong>Branch code:</strong> {BANK_DETAILS.branchCode}</div>
            <div><strong>Account type:</strong> {BANK_DETAILS.accountType || 'Cheque'}</div>
            <div><strong>Reference:</strong> {reference}</div>
            <div><strong>POP to:</strong> {BANK_DETAILS.emailPOP}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ id, className, children }:{id?:string,className?:string,children:any}) => (
  <section id={id} className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className || ""}`}>{children}</section>
);

const Fade = ({ children, delay = 0 }:{children:any,delay?:number}) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }}>{children}</motion.div>
);

const ProductCard = ({ title, desc, price, image, onReview }:{title:string,desc:string,price:string,image:string,onReview:(x:any)=>void}) => (
  <Card className="group overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="p-0">
      <div className="relative h-60 w-full overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
    </CardHeader>
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-1">{desc}</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-500">from</p>
          <p className="text-xl font-semibold">{price}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button className="gap-2" onClick={() => window.open(`${SHOPIFY_STORE_URL}/products/${SHOPIFY_DEMO_PRODUCT}`, "_blank")}>
          <ShoppingCart className="h-4 w-4" /> View in shop (demo)
        </Button>
        <Button variant="secondary" className="gap-2" onClick={() => submitPayfastPayment({
          amount: (price || "0").toString().replace(/[^0-9.]/g, ""),
          item_name: title,
          item_description: desc,
        })}>
          Pay with PayFast (Demo)
        </Button>
        <QRPayButton title={title} desc={desc} price={price} />
        <Button variant="outline" className="gap-2" onClick={() => onReview({
          title, desc, unit: parseFloat((price || "0").toString().replace(/[^0-9.]/g, ""))
        })}>
          Review & Checkout
        </Button>
      </div>
    </CardContent>
  </Card>
);

function QRPayButton({ title, desc, price }:{title:string,desc:string,price:string}) {
  const [open, setOpen] = useState(false);
  const numeric = (price || "0").toString().replace(/[^0-9.]/g, "");
  const reference = `ORDER-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const payloadText = `Payee:${BANK_DETAILS.accountName}|Bank:${BANK_DETAILS.bank}|Acc:${BANK_DETAILS.accountNumber}|Branch:${BANK_DETAILS.branchCode}|Amount:R${numeric}|Ref:${reference}|Item:${title}`;
  return (
    <>
      <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <QrCode className="h-4 w-4"/> Scan to pay (EFT)
      </Button>
      <QRPayModal open={open} onClose={() => setOpen(false)} payloadText={payloadText} amount={numeric} reference={reference} />
    </>
  );
}

export default function Page() {
  const [reviewItem, setReviewItem] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState<any>({ name: "", email: "", phone: "", address: "", city: "", postal: "", grind: "Whole bean", qty: 1, shipping: "pickup" });
  function handleReview({ title, desc, unit }:{title:string,desc:string,unit:number}) {
    setReviewItem({ title, desc, unit });
    const el = document.getElementById('checkout');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full backdrop-blur bg-white/80 border-b">
        <Section className="flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-semibold">
            <CoffeeIcon className="h-5 w-5" /> Beanery Blend
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:opacity-70" href="#shop">Shop</a>
            <a className="hover:opacity-70" href="#about">Our Story</a>
            <a className="hover:opacity-70" href="#subscribe">Subscribe</a>
            <a className="hover:opacity-70" href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={()=>location.assign('#shop')}>Shop now</Button>
          </div>
        </Section>
      </header>

      <Section id="home" className="pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Fade>
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Welcome to Beanery Blend, where flavor transcends.</h1>
              <p className="mt-4 text-lg text-neutral-600 max-w-prose">Our flagship blend unites Ugandan and Brazilian origins for a bright citrus lift with a comforting cocoa finish — a daily ritual crafted with care.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="gap-2" onClick={() => window.open(`${SHOPIFY_STORE_URL}/products/${SHOPIFY_DEMO_PRODUCT}`, "_blank")}>
                  <ShoppingCart className="h-4 w-4"/> Shop Beans
                </Button>
              </div>
            </div>
          </Fade>
          <Fade delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-md">
              <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1600&auto=format&fit=crop" alt="Beanery Blend coffee beans and cup" className="h-full w-full object-cover"/>
            </div>
          </Fade>
        </div>
      </Section>

      <Section id="shop" className="py-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Shop the Beans</h2>
        <p className="text-sm text-neutral-600">Preview checkout via Shopify demo, or use <strong>PayFast (Sandbox)</strong> / <strong>Scan to pay (EFT)</strong>. Then use <em>Review & Checkout</em> to confirm details.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard onReview={handleReview} title="Beanery Blend — 250g" desc="Uganda x Brazil • citrus & cocoa" price="R120" image="https://images.unsplash.com/photo-1473929737295-46bddc3e3016?q=80&w=1600&auto=format&fit=crop" />
          <ProductCard onReview={handleReview} title="Beanery Blend — 1kg" desc="Family-size freshness for serious sippers" price="R420" image="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1600&auto=format&fit=crop" />
          <ProductCard onReview={handleReview} title="Decaf — 250g" desc="Sugarcane process • balanced sweetness" price="R140" image="https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1600&auto=format&fit=crop" />
        </div>
        <Card className="mt-10 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">How payments work (Demo)</CardTitle>
            <CardDescription>PayFast uses sandbox keys; QR encodes bank details + order ref. No real charges.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 text-sm text-neutral-600">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Shopify demo</strong>: view product in demo store.</li>
              <li><strong>PayFast (Sandbox)</strong>: redirects to PayFast test checkout.</li>
              <li><strong>Scan to pay (EFT)</strong>: opens a QR with your EFT details and unique reference.</li>
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section id="checkout" className="py-16">
        <Card className="rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle>Order review</CardTitle>
            <CardDescription>Confirm your details and choose a payment method. Demo only.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Full name" value={orderInfo.name} onChange={e=>setOrderInfo({...orderInfo,name:e.target.value})} />
                  <Input type="email" placeholder="Email" value={orderInfo.email} onChange={e=>setOrderInfo({...orderInfo,email:e.target.value})} />
                  <Input placeholder="Phone" value={orderInfo.phone} onChange={e=>setOrderInfo({...orderInfo,phone:e.target.value})} />
                  <Input placeholder="Address" value={orderInfo.address} onChange={e=>setOrderInfo({...orderInfo,address:e.target.value})} className="sm:col-span-2" />
                  <Input placeholder="City" value={orderInfo.city} onChange={e=>setOrderInfo({...orderInfo,city:e.target.value})} />
                  <Input placeholder="Postal code" value={orderInfo.postal} onChange={e=>setOrderInfo({...orderInfo,postal:e.target.value})} />
                  <Input placeholder="Grind (e.g., Whole bean)" value={orderInfo.grind} onChange={e=>setOrderInfo({...orderInfo,grind:e.target.value})} />
                  <Input type="number" min={1} placeholder="Qty" value={orderInfo.qty} onChange={e=>setOrderInfo({...orderInfo,qty:Math.max(1,Number(e.target.value||1))})} />
                  <select className="border rounded-md h-10 px-3" value={orderInfo.shipping} onChange={e=>setOrderInfo({...orderInfo,shipping:e.target.value})}>
                    <option value="pickup">Pickup (Durbanville) – R0</option>
                    <option value="local">Cape Town courier – R60</option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="rounded-2xl border p-4 bg-neutral-50">
                  <div className="font-semibold">Summary</div>
                  <div className="mt-3 text-sm">
                    <div>Item: {reviewItem ? reviewItem.title : "Select a product above"}</div>
                    <div>Unit: R{reviewItem ? reviewItem.unit.toFixed(2) : "0.00"}</div>
                    <div>Qty: {orderInfo.qty}</div>
                    <div>Shipping: {orderInfo.shipping === 'local' ? 'R60.00' : 'R0.00'}</div>
                    <hr className="my-2"/>
                    <div className="font-semibold">Total: R{(() => {
                      const unit = reviewItem ? reviewItem.unit : 0;
                      const ship = orderInfo.shipping === 'local' ? 60 : 0;
                      return (unit * orderInfo.qty + ship).toFixed(2);
                    })()}</div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <Button onClick={() => {
                      if (!reviewItem) return alert('Please select a product in the Shop section first.');
                      const total = (reviewItem.unit * orderInfo.qty + (orderInfo.shipping==='local'?60:0)).toFixed(2);
                      submitPayfastPayment({
                        amount: total,
                        item_name: `${reviewItem.title} x${orderInfo.qty}`,
                        item_description: `Grind: ${orderInfo.grind} | ${orderInfo.city} ${orderInfo.postal}`,
                      });
                    }}>Pay with PayFast (Demo)</Button>
                    <QRPayButton title={reviewItem ? `${reviewItem.title} x${orderInfo.qty}` : 'Coffee order'} desc={orderInfo.grind} price={`R${(() => { const unit = reviewItem ? reviewItem.unit : 0; const ship = orderInfo.shipping==='local'?60:0; return (unit*orderInfo.qty+ship).toFixed(2); })()}`} />
                    <p className="text-xs text-neutral-500">Tip: Please use your <strong>Order #</strong> as the EFT reference. You can copy it from the QR modal or your confirmation.</p>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">No real charges in demo. For live payments we’ll enable signatures and your real bank details.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <footer className="border-t py-10 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} Beanery Blend. Demo Shopify + PayFast + QR EFT active (no real charges).</p>
      </footer>
    </div>
  );
}
