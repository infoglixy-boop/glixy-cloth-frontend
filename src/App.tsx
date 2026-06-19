import { useEffect } from 'react'
import { StoreProvider } from './context/StoreContext'
import { ContentProvider, useContent } from './context/ContentContext'
import ScrollProgress from './components/ScrollProgress'
import Announce from './components/Announce'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Categories from './components/Categories'
import Usp from './components/Usp'
import ProductSection from './components/ProductSection'
import Lookbook from './components/Lookbook'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WishlistDrawer from './components/WishlistDrawer'
import LoginModal from './components/LoginModal'
import Chatbot from './components/Chatbot'
import InfoModal from './components/InfoModal'
import Toast from './components/Toast'

function HeadSync() {
  const { settings } = useContent()
  useEffect(() => {
    document.title = `${settings.storeName} — ${settings.storeTagline}`
    if (settings.favicon) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = settings.favicon
    }
  }, [settings.storeName, settings.storeTagline, settings.favicon])
  return null
}

function Sections() {
  const { products } = useContent()
  return (
    <>
      <ProductSection
        id="new"
        index="( 03 )"
        subtitle="Fresh on the rack"
        title="New Arrivals"
        products={products.new}
      />
      <Lookbook />
      <ProductSection
        id="best"
        index="( 04 )"
        subtitle="Loved by the gang"
        title="Bestsellers"
        products={products.best}
      />
      <Usp />
      <ProductSection
        id="sale"
        index="( 05 )"
        subtitle="Up to 65% off"
        title="End of Season Sale"
        products={products.sale}
      />
    </>
  )
}

function App() {
  return (
    <ContentProvider>
      <StoreProvider>
        <HeadSync />
        <ScrollProgress />
        <Announce />
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Categories />
          <Sections />
          <Newsletter />
        </main>
        <Footer />

        <CartDrawer />
        <WishlistDrawer />
        <LoginModal />
        <InfoModal />
        <Chatbot />
        <Toast />
      </StoreProvider>
    </ContentProvider>
  )
}

export default App
