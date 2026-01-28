import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Composant Calendrier avancé réutilisable
 * 
 * Fonctionnalités:
 * - Navigation mois/année
 * - Sélection de dates
 * - Marquage de dates spéciales
 * - Plages de dates
 * - Personnalisable
 */

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onDateRangeSelect?: (startDate: Date, endDate: Date) => void;
  disabledDates?: Date[];
  selectedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  markedDates?: Record<string, any>;
  markingType?: 'dot' | 'period' | 'multi-dot' | 'multi-period';
  theme?: Record<string, string>;
  onMonthChange?: (month: number, year: number) => void;
}

const CALENDAR_HEIGHT = 360;
const CALENDAR_WIDTH = Dimensions.get('window').width - 32;

export const Calendar = React.forwardRef<any, CalendarProps>(
  (
    {
      onDateSelect,
      onDateRangeSelect,
      disabledDates = [],
      selectedDates = [],
      minDate,
      maxDate,
      markedDates = {},
      markingType = 'dot',
      theme = {},
      onMonthChange,
    },
    ref
  ) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];

    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getLastDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    const getMonthDays = (date: Date) => {
      const firstDay = getFirstDayOfMonth(date);
      const lastDay = getLastDayOfMonth(date);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(date.getFullYear(), date.getMonth(), i));
      }
      return days;
    };

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return disabledDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
    };

    const isDateSelected = (date: Date) => {
      return selectedDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
    };

    const isDateInRange = (date: Date) => {
      if (!rangeStart || !rangeEnd) return false;
      return date >= rangeStart && date <= rangeEnd;
    };

    const handleDatePress = (date: Date) => {
      if (isDateDisabled(date)) return;

      onDateSelect?.(date);

      if (onDateRangeSelect) {
        if (!rangeStart) {
          setRangeStart(date);
        } else if (!rangeEnd && date > rangeStart) {
          setRangeEnd(date);
          onDateRangeSelect(rangeStart, date);
          setRangeStart(null);
          setRangeEnd(null);
        } else {
          setRangeStart(date);
          setRangeEnd(null);
        }
      }
    };

    const handlePrevMonth = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
      onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
    };

    const handleNextMonth = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
      onMonthChange?.(newDate.getMonth(), newDate.getFullYear());
    };

    const handleTodayPress = () => {
      setCurrentDate(new Date());
      onMonthChange?.(new Date().getMonth(), new Date().getFullYear());
    };

    const monthDays = getMonthDays(currentDate);
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }

    const defaultTheme = {
      backgroundColor: '#fff',
      textColor: '#1a1a1a',
      dotColor: '#007AFF',
      selectedBackgroundColor: '#007AFF',
      selectedTextColor: '#fff',
      rangeBackgroundColor: '#e0f2ff',
      disabledTextColor: '#ccc',
      ...theme,
    };

    return (
      <View style={[styles.container, { backgroundColor: defaultTheme.backgroundColor }]}>
        {/* Entête */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={defaultTheme.textColor} />
          </TouchableOpacity>

          <View style={styles.monthYear}>
            <Text style={[styles.monthText, { color: defaultTheme.textColor }]}>
              {monthNames[currentDate.getMonth()]}
            </Text>
            <Text style={[styles.yearText, { color: defaultTheme.textColor }]}>
              {currentDate.getFullYear()}
            </Text>
          </View>

          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={defaultTheme.textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTodayPress}
            style={[styles.todayButton, { backgroundColor: defaultTheme.selectedBackgroundColor }]}
          >
            <Text style={[styles.todayText, { color: defaultTheme.selectedTextColor }]}>
              Auj.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Jours de la semaine */}
        <View style={styles.weekDays}>
          {dayNames.map((day) => (
            <Text
              key={day}
              style={[styles.dayName, { color: defaultTheme.textColor, opacity: 0.6 }]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Semaines */}
        <View style={styles.weeks}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => {
                const dateKey = day
                  ? `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
                  : `empty-${weekIndex}-${dayIndex}`;

                if (!day) {
                  return <View key={dateKey} style={styles.emptyDay} />;
                }

                const isDisabled = isDateDisabled(day);
                const isSelected = isDateSelected(day);
                const inRange = isDateInRange(day);
                const isRangeStart = rangeStart && rangeStart.toDateString() === day.toDateString();
                const isRangeEnd = rangeEnd && rangeEnd.toDateString() === day.toDateString();

                return (
                  <TouchableOpacity
                    key={dateKey}
                    onPress={() => handleDatePress(day)}
                    disabled={isDisabled}
                    style={[
                      styles.day,
                      isDisabled && styles.dayDisabled,
                      isSelected && [
                        styles.daySelected,
                        { backgroundColor: defaultTheme.selectedBackgroundColor },
                      ],
                      inRange && [
                        styles.dayInRange,
                        { backgroundColor: defaultTheme.rangeBackgroundColor },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: isDisabled
                            ? defaultTheme.disabledTextColor
                            : isSelected
                            ? defaultTheme.selectedTextColor
                            : defaultTheme.textColor,
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>

                    {/* Marqueur */}
                    {markedDates[dateKey] && markingType === 'dot' && (
                      <View
                        style={[
                          styles.marker,
                          {
                            backgroundColor:
                              markedDates[dateKey].color || defaultTheme.dotColor,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

Calendar.displayName = 'Calendar';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    alignItems: 'center',
    flex: 1,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
  },
  yearText: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayName: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
  weeks: {
    gap: 4,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  emptyDay: {
    width: '14.28%',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dayDisabled: {
    opacity: 0.4,
  },
  daySelected: {
    borderRadius: 8,
  },
  dayInRange: {
    borderRadius: 0,
  },
  marker: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default Calendar;
