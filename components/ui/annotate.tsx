import React from 'react';
import { LabelAnnotation } from "@react-financial-charts/annotations";
import { ArrowUpCircle, ArrowDownCircle, Clock, XCircle } from 'lucide-react';

const OrderAnnotation = ({ order, yScale, datum }) => {
  const getOrderDetails = () => {
    const { side, status, comment, limit_price, pnl } = order;
    
    let icon, backgroundColor, textColor, statusText;
    
    switch (status) {
      case 'filled':
        icon = side === 'buy' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />;
        backgroundColor = side === 'buy' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
        textColor = side === 'buy' ? '#006400' : '#8B0000';
        statusText = 'Filled';
        break;
      case 'new':
        icon = <Clock size={16} />;
        backgroundColor = 'rgba(255, 255, 0, 0.2)';
        textColor = '#808000';
        statusText = 'New';
        break;
      case 'canceled':
        icon = <XCircle size={16} />;
        backgroundColor = 'rgba(128, 128, 128, 0.2)';
        textColor = '#4B0082';
        statusText = 'Canceled';
        break;
      default:
        icon = <Clock size={16} />;
        backgroundColor = 'rgba(255, 255, 255, 0.2)';
        textColor = '#000000';
        statusText = 'Unknown';
    }

    const text = `${side.toUpperCase()} ${statusText}`;
    const tooltip = `${comment} at: ${limit_price}${pnl ? ` PnL: ${pnl}` : ''}`;

    return { icon, backgroundColor, textColor, text, tooltip };
  };

  const { icon, backgroundColor, textColor, text, tooltip } = getOrderDetails();

  return (
    <LabelAnnotation
      text={text}
      tooltip={tooltip}
      y={yScale(datum.high)}
      fill={textColor}
      backgroundColor={backgroundColor}
      opacity={1}
      fontSize={12}
      fontWeight="bold"
      textPadding={4}
      width={70}
      height={20}
      cornerRadius={10}
      renderText={(ctx, text) => {
        ctx.fillStyle = textColor;
        ctx.font = "bold 12px Arial";
        ctx.fillText(text, 20, 14);
        icon.type.render(icon.props, { x: 2, y: 2, width: 16, height: 16, fill: textColor });
      }}
    />
  );
};

export default OrderAnnotation;