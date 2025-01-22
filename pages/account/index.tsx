import NavBar from '@/components/common/NavBar';
import Hero from '@/components/common/Hero';
import Layout from '@/components/common/Layout';
import AccountSecurity from './AccountSecurity';
import AccountOwnedDatasets from './AccountOwnedDatasets';
import AccountRequests from './AccountRequests';


export default function AccountPage() {
 
  return (
    <>
    <NavBar />
    <Hero
      header="Account Settings"
    />
    <Layout>
        <AccountSecurity />
        <AccountOwnedDatasets />
        <AccountRequests />
    </Layout>
    </>
  );
}