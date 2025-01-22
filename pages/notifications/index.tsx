import Layout from '@/components/common/Layout'
import NavBar from '@/components/common/NavBar'
import { NextPage } from 'next'

const NotificationsPage: NextPage = () => {
  return (
    <div>
    <NavBar />
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <p>Notifications coming later</p>
        </div>
      </main>
    </Layout>
    </div>
  )
}

export default NotificationsPage
