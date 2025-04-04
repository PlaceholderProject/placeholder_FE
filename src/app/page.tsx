//  완전 루트 페이지
import MainLayout from "./(providers)/(root)/(main)/layout";
import MainPage from "./(providers)/(root)/(main)/page";

const Home = () => {
  return (
    <>
      <div>
        <MainLayout>
          <MainPage />
        </MainLayout>
      </div>
    </>
  );
};

export default Home;
