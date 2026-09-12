const CART_KEY='camille-cart-v3';
const VALID_SLUGS=new Set([
  'the-wealth-operating-system',
  'the-profit-clarity-planner',
  'the-premium-offer-architect',
  'brand-with-weight',
  'the-digital-product-studio',
  'the-signature-content-system',
  'the-calm-launch-playbook',
  'the-elevated-sales-page-kit',
  'the-solo-ceo-operating-desk'
]);

try{
  const stored=JSON.parse(localStorage.getItem(CART_KEY)||'{"items":[]}');
  if(Array.isArray(stored.items)){
    stored.items=stored.items.filter(item=>VALID_SLUGS.has(item.slug));
    localStorage.setItem(CART_KEY,JSON.stringify(stored));
  }
}catch{}

const nativeFetch=window.fetch.bind(window);
window.fetch=async (...args)=>{
  const response=await nativeFetch(...args);
  try{
    const url=String(args[0]||'');
    const body=typeof args[1]?.body==='string'?args[1].body:'';
    if(url.includes('myshopify.com/api/')&&body.includes('products(first:40)')){
      const data=await response.clone().json();
      const nodes=data?.data?.products?.edges?.map(edge=>edge.node)||[];
      window.__camilleCatalog=Object.fromEntries(nodes.map(product=>[
        product.handle,
        {
          title:product.title,
          image:product.images?.edges?.[0]?.node?.url||'',
          variants:product.variants?.edges?.map(edge=>edge.node)||[]
        }
      ]));
      window.dispatchEvent(new CustomEvent('camille:catalog'));
    }
  }catch{}
  return response;
};
