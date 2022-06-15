import BlankLayout from '../../../components/BlankLayout';
import TopicPageView from '../../../components/TopicPageView';

export default function TopicPage() {
  return <TopicPageView embed />;
}

TopicPage.getLayout = function getLayout(page: React.ReactChildren) {
  return <BlankLayout>{page}</BlankLayout>;
};
