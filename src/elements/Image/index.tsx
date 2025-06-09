import ImageLib, { ImageProps } from "next/image";

const Image = ({ width = "100", height = "100", ...props }: ImageProps) => {
  return (
    <>
      <ImageLib width={width} height={height} {...props} />
    </>
  );
};

export default Image;
