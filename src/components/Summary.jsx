import React from "react";

const Summary = ({ coinData }) => {
  if (!coinData || !coinData.description || !coinData.description.en) {
    return null;
  }

  const summaryText = coinData.description.en.slice(0, 150) + "...";

  return (
    <div className="">
      <div className="mb-4">
        <h3 className="font-bold text-lg">Summary</h3>
        <p>{summaryText}</p>
      </div>
      <div
        className="overflow-y-scroll h-72 whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: coinData.description.en }}
      ></div>
    </div>
  );
};

export default Summary;
