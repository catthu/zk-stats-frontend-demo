import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api, APIEndPoints } from '@/utils/api';
import { Dataset } from '@/types/dataset';
import { FullRequest } from '@/types/request';
import { DatasetCard } from '@/components/datasets/DatasetCard';
import Layout from '@/components/common/Layout';
import NavBar from '@/components/common/NavBar';
import RequestCard from '@/components/requests/RequestCard';

interface User {
  user_id: string;
  username: string;
  // Add other user fields as needed
}

interface UserProfileProps {
  userData: {
    user: User;
    datasets: Dataset[];
    requests: FullRequest[];
  } | null;
}

export default function UserProfile({ userData }: UserProfileProps) {
  if (!userData) {
    return (
      <>
      <NavBar />
      <Layout>
        <div>User not found</div>
      </Layout>
      </>
  )
  }

  const { user, datasets, requests } = userData;

  return (
    <>
    <NavBar />
    <Layout>
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{user.username}&apos;s Profile</h1>
      </div>

      {/* Datasets Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Datasets</h2>
        {datasets.length === 0 ? (
          <p>No datasets found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
             <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}
      </section>

      {/* Requests Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Computation Requests</h2>
        {requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
              <RequestCard fullRequest={request} key={request.id} />
            ))}
          </div>
        )}
      </section>
    </div>
    </Layout>
    </>
  );
}

export async function getServerSideProps({ params }: { params: { id: string } }) {
  try {
    const { data: userData } = await api(APIEndPoints.GetUserWithDatasetsAndRequests, { userId: params.id });
    
    if (!userData) {
      return {
        props: {
          userData: null
        }
      };
    }

    return {
      props: {
        userData: {
          user: userData,
          datasets: userData.datasets || [],
          requests: userData.requests || []
        }
      }
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      props: {
        userData: null
      }
    };
  }
}
