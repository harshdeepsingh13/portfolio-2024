import Loader from "../components/Loader/index";
const Loading = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "95vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
        <p>Painting the Digital Canvas, Please Wait...</p>
      </div>
    </>
  );
};

export default Loading;
