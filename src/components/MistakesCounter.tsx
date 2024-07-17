import { Typography } from "@mui/material";

interface MistakesCounterProps {
  mistakes: number;
}

const MistakesCounter: React.FC<MistakesCounterProps> = ({ mistakes }) => (
  <Typography variant="h6" sx={{ textAlign: "center", margin: "1rem 0" }}>
    Mistakes: {mistakes} / 3
  </Typography>
);

export default MistakesCounter;
