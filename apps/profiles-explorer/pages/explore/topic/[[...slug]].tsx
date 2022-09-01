import Layout from '../../../components/Layout';
import TopicPageView from '../../../components/TopicPageView';

export default function TopicPage() {
  return <TopicPageView />;
}

TopicPage.getLayout = function getLayout(page: React.ReactChildren) {
  return <Layout>{page}</Layout>;
};
