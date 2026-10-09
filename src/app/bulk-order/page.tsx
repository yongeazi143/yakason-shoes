import type { Metadata } from 'next';
import BulkOrderPageContent from '@/components/bulk-order/BulkOrderPageContent';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Request a Bulk Quote | ${SITE.name}`,
  description: `Direct from our Lagos factory floor. CAC (RC ${SITE.rcNumber}) & SON Certified Quality.`,
  openGraph: {
    title: `Request a Bulk Quote | ${SITE.name}`,
    description: `Direct from our Lagos factory floor. CAC (RC ${SITE.rcNumber}) & SON Certified Quality.`,
    images: [...SITE.seo.openGraph.images],
  },
};

export default function BulkOrderPage() {
  return <BulkOrderPageContent />;
}
