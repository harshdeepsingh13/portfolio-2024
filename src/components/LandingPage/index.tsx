import useSWR from "swr";

const LandingPage = () => {
    const {data: basicInformation ,isLoading: basicInformationLoading} = useSWR()
  return <>LandingPage</>;
};

export default LandingPage;
