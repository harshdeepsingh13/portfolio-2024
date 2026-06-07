import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const BlogPostLoading = () => {
  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 15px" }}>
      {/* Cover image skeleton */}
      <Skeleton variant="rectangular" width="100%" height={360} sx={{ borderRadius: "16px", mb: 3 }} />

      {/* Title skeleton */}
      <Skeleton variant="text" width="75%" height={52} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="45%" height={36} sx={{ mb: 2 }} />

      {/* Meta row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[120, 90, 100, 160].map((w, i) => (
          <Grid key={i}>
            <Skeleton variant="text" width={w} height={22} />
          </Grid>
        ))}
      </Grid>

      {/* Body paragraphs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i % 5 === 4 ? "60%" : "100%"}
          height={22}
          sx={{ mb: 0.5 }}
        />
      ))}
      <Skeleton variant="text" width="100%" height={22} sx={{ mb: 2, mt: 1 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={`b2-${i}`}
          variant="text"
          width={i % 4 === 3 ? "40%" : "100%"}
          height={22}
          sx={{ mb: 0.5 }}
        />
      ))}
    </Box>
  );
};

export default BlogPostLoading;
