interface CircleProps {
  radius: number;
  outerColor: string;
  innerColor?: string
  centerX?: number;
  centerY?: number;
  proportion?: number ;
}

const CircleDecorator: React.FC<CircleProps> = ({ 
    radius, 
    outerColor, 
    innerColor='white',
    centerX=200, 
    centerY=200, 
    proportion=1.8, 
}) => {
  return (
    <svg width="100%" height="100%">
      <circle
        r={radius}
        cx={centerX}
        cy={centerY}
        fill={outerColor}
      />
      <circle
        r={radius / proportion}
        cx={centerX}
        cy={centerY}
        fill={innerColor}
      />
    </svg>
  );
};

export default CircleDecorator;