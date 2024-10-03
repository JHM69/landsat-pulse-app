import React, { useState } from 'react'; 
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';

const TimePicker = ({ value, onChange }) => {
    // Trading hours: 4:00 AM to 8:00 PM EST (including pre-market and after-hours)
    const hours = Array.from({ length: 17 }, (_, i) => i + 1);
    const minutes = [0, 15, 30, 45];
  
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="relative w-64 h-64 rounded-full border-4 border-gray-300 shadow-lg dark:border-gray-600">
          {/* Hour buttons */}
          {hours.map((hour) => (
            <button
              key={hour}
              className={`absolute z-20 w-10 h-10 rounded-full flex justify-center items-center 
                text-sm font-medium transition-all duration-200 ${
                  value.hour === hour
                    ? 'bg-blue-500 text-white shadow-md scale-110'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                }`}
              style={{
                left: `${50 + 40 * Math.sin(((hour - 3) / 12) * 2 * Math.PI)}%`, // Adjusted for 12-hour circle
                top: `${50 - 40 * Math.cos(((hour - 3) / 12) * 2 * Math.PI)}%`,  // Adjusted for 12-hour circle
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onChange({ ...value, hour })}
            >
              {hour}
            </button>
          ))}
  
          {/* Minute buttons inside a smaller circle */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-32 h-32 rounded-full border-2 border-gray-200 dark:border-gray-600 flex justify-center items-center relative">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  className={`absolute w-8 h-8 rounded-full flex justify-center items-center 
                    text-sm font-medium transition-all duration-200 ${
                      value.minute === minute
                        ? 'bg-green-600 text-white shadow-md scale-110'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                    }`}
                  style={{
                    left: `${50 + 30 * Math.sin((minute / 60) * 2 * Math.PI)}%`, // Adjusted for 12-hour circle
                    top: `${50 - 30 * Math.cos((minute / 60) * 2 * Math.PI)}%`,  // Adjusted for 12-hour circle
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => onChange({ ...value, minute })}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

const TimeRangeSelector = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTime, setActiveTime] = useState('start');
    const [tempStartTime, setTempStartTime] = useState(startTime);
    const [tempEndTime, setTempEndTime] = useState(endTime);
  
    const formatTime = (time) => `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
  
    const handleTimeChange = (newTime) => {
      if (activeTime === 'start') {
        setTempStartTime(newTime);
      } else {
        setTempEndTime(newTime);
      }
    };
  
    const handleOkClick = () => {
      onStartTimeChange(tempStartTime);
      onEndTimeChange(tempEndTime);
      setIsDialogOpen(false);
    };
  
    const handleOpenChange = (open) => {
      if (open) {
        setTempStartTime(startTime);
        setTempEndTime(endTime);
      }
      setIsDialogOpen(open);
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-48">
              <Clock className="mr-2 h-4 w-4" />
              {formatTime(startTime)} - {formatTime(endTime)}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Trading Time Range</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-4">
                <Button
                  variant={activeTime === 'start' ? 'default' : 'outline'}
                  onClick={() => setActiveTime('start')}
                >
                  Start: {formatTime(tempStartTime)}
                </Button>
                <Button
                  variant={activeTime === 'end' ? 'default' : 'outline'}
                  onClick={() => setActiveTime('end')}
                >
                  End: {formatTime(tempEndTime)}
                </Button>
              </div>
              <TimePicker
                value={activeTime === 'start' ? tempStartTime : tempEndTime}
                onChange={handleTimeChange}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleOkClick}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };


export { TimeRangeSelector };