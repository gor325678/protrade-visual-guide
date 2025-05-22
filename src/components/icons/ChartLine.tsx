
import React from 'react';
import { LineChart } from 'lucide-react';

// This component serves as a wrapper for the LineChart icon
// Named as ChartLine to maintain consistency with existing code
const ChartLine = (props: React.ComponentProps<typeof LineChart>) => {
  return <LineChart {...props} />;
};

export default ChartLine;
