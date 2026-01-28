import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FilterOption {
  id: string | number;
  label: string;
  icon?: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilters: (string | number)[];
  onFilterChange: (filterId: string | number) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
  onOpenAdvancedFilters?: () => void;
  showAdvancedButton?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  multiSelect = false,
  style,
  onOpenAdvancedFilters,
  showAdvancedButton = true,
}) => {
  const handlePress = (filterId: string | number) => {
    if (multiSelect) {
      onFilterChange(filterId);
    } else {
      if (selectedFilters.includes(filterId)) {
        onFilterChange(filterId);
      } else {
        onFilterChange(filterId);
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonActive,
              ]}
              onPress={() => handlePress(filter.id)}
              activeOpacity={0.7}
            >
              {filter.icon && (
                <MaterialCommunityIcons
                  name={filter.icon as any}
                  size={16}
                  color={isSelected ? '#ffffff' : '#6b7280'}
                  style={styles.filterIcon}
                />
              )}
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {showAdvancedButton && onOpenAdvancedFilters && (
          <TouchableOpacity
            style={styles.advancedButton}
            onPress={onOpenAdvancedFilters}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="tune"
              size={18}
              color="#6366f1"
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  advancedButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilterBar;
