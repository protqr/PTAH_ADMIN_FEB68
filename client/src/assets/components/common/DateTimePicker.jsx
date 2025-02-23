import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const DateTimePicker = ({ name, label, initValue, onChange, format }) => {
    // Initialize state with the provided initial value or current date/time
    const [selectedDate, setSelectedDate] = useState(
        initValue ? dayjs(initValue).toDate() : new Date()
    );

    // Handle date change
    const handleChange = (date) => {
        setSelectedDate(date);
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: dayjs(date).toJSON(),
                },
            });
        }
    };

    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {label || name}
            </label>
            <ReactDatePicker
                selected={selectedDate}
                onChange={handleChange}
                showTimeSelect
                dateFormat={format ?? "yyyy-MM-dd HH:mm"}
                timeFormat="HH:mm"
                timeIntervals={15}
                className="form-control form-input"
            />
        </div>
    );
}

export default DateTimePicker;


// import React, { useState } from "react";
// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import dayjs from "dayjs";

// const DateTimePicker = ({ name, label, initValue, onChange, format }) => {
//   // State management for daily selection and date/time
//   const [isDaily, setIsDaily] = useState(
//     initValue?.startsWith("ทุกวัน:") || false
//   );
//   const [selectedDate, setSelectedDate] = useState(
//     initValue && !initValue.startsWith("ทุกวัน:")
//       ? dayjs(initValue).toDate()
//       : new Date()
//   );
//   const [dailyTime, setDailyTime] = useState(
//     initValue?.startsWith("ทุกวัน:") ? initValue.split(":")[1] : "00:00"
//   );

//   // Handle toggling between daily and specific date/time
//   const handleToggleDaily = (e) => {
//     const checked = e.target.checked;
//     setIsDaily(checked);
//     if (checked) {
//       // Save the selected time and notify the parent
//       onChange({
//         target: {
//           name,
//           value: `ทุกวัน:${dailyTime}`,
//         },
//       });
//     } else {
//       // Reset to selected date and notify the parent
//       onChange({
//         target: {
//           name,
//           value: dayjs(selectedDate).toJSON(),
//         },
//       });
//     }
//   };

//   // Handle time input for daily notifications
//   const handleTimeChange = (e) => {
//     const time = e.target.value;
//     setDailyTime(time);
//     if (isDaily) {
//       onChange({
//         target: {
//           name,
//           value: `ทุกวัน:${time}`,
//         },
//       });
//     }
//   };

//   // Handle specific date/time change
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     if (!isDaily) {
//       onChange({
//         target: {
//           name,
//           value: dayjs(date).toJSON(),
//         },
//       });
//     }
//   };

//   return (
//     <div className="form-row">
//       <label htmlFor={name} className="form-label">
//         {label || name}
//       </label>
//       {!isDaily ? (
//         <ReactDatePicker
//           selected={selectedDate}
//           onChange={handleDateChange}
//           showTimeSelect
//           dateFormat={format ?? "yyyy-MM-dd HH:mm"}
//           timeFormat="HH:mm"
//           timeIntervals={15}
//           className="form-control form-input"
//         />
//       ) : (
//         <div>
//           <ReactDatePicker
//             selected={selectedDate}
//             onChange={handleDateChange}
//             showTimeSelect
//             dateFormat={format ?? "yyyy-MM-dd HH:mm"}
//             timeFormat="HH:mm"
//             timeIntervals={15}
//             className="form-control form-input"
//             disabled
//           />
//           <input
//             type="time"
//             value={dailyTime}
//             onChange={handleTimeChange}
//             className="form-control form-input"
//           />
//         </div>
//       )}
//       <div className="form-checkbox">
//         <label>
//           <input
//             type="checkbox"
//             checked={isDaily}
//             onChange={handleToggleDaily}
//           />
//           ทุกวัน
//         </label>
//       </div>
//     </div>
//   );
// };

// export default DateTimePicker;

