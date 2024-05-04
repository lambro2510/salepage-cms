import React from 'react';
import dayjs, { Dayjs, OpUnitType } from 'dayjs';
import { DatePicker, Space, TimeRangePickerProps } from 'antd';

const { RangePicker } = DatePicker;

const RangeDate: React.FC<any> = ({ rangeDate, setRangeDate }) => {
  const startOfQuarter = (): Dayjs => {
    const currentMonth = dayjs().month();
    const startMonth = currentMonth - (currentMonth % 3);
    return dayjs().startOf('month').set('month', startMonth);
  };

  const endOfQuarter = (): Dayjs => {
    const currentMonth = dayjs().month();
    const endMonth = currentMonth - (currentMonth % 3) + 2;
    return dayjs().endOf('month').set('month', endMonth);
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    {
      label: 'Tuần này',
      value: [dayjs().startOf('week'), dayjs().endOf('week')],
    },
    {
      label: 'Tuần trước',
      value: [
        dayjs().startOf('week').subtract(1, 'week'),
        dayjs().endOf('week').subtract(1, 'week'),
      ],
    },
    {
      label: 'Tháng này',
      value: [dayjs().startOf('month'), dayjs().endOf('month')],
    },
    {
      label: 'Tháng trước',
      value: [
        dayjs().startOf('month').subtract(1, 'month'),
        dayjs().endOf('month').subtract(1, 'month'),
      ],
    },
    {
      label: '3 tháng trước',
      value: [
        dayjs().startOf('month').subtract(2, 'month'),
        dayjs().endOf('month').subtract(1, 'month'),
      ],
    },
    { label: 'Quý này', value: [startOfQuarter(), endOfQuarter()] },
    {
      label: 'Năm này',
      value: [dayjs().startOf('year'), dayjs().endOf('year')],
    },
  ];

  return (
    <Space direction="vertical">
      <RangePicker
        presets={rangePresets}
        value={rangeDate}
        onChange={setRangeDate}
      />
    </Space>
  );
};

export default RangeDate;
