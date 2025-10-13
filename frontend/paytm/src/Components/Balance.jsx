import React from 'react';

export const Balance = ({ value }) => {
    return (
        <div className="flex items-center p-4 md:p-6">
            <div className="font-bold text-lg">
                Your balance:
            </div>
            <div className="font-semibold ml-4 text-lg">
                ₹ {parseFloat(value).toFixed(2)}
            </div>
        </div>
    );
};
