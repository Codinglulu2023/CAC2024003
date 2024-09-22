import dynamic from 'next/dynamic';
 
const NoSSR = dynamic(() => import('./Analysis'), { ssr: false })
 
export default function Page() {
  return (
    <div>
      <NoSSR />
    </div>
  )
}
