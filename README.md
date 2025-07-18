# Recurring Date Picker Component

A comprehensive, production-ready recurring date picker component built with Next.js, React, and TypeScript. This component allows users to configure complex recurring date patterns similar to popular calendar applications like TickTick.

## 🚀 Features

### Core Functionality
- **Recurring Types**: Daily, Weekly, Monthly, and Yearly patterns
- **Custom Intervals**: Configure every X days/weeks/months/years
- **Advanced Patterns**: 
  - Select specific days of the week
  - Monthly patterns like "2nd Tuesday of every month"
  - Flexible date range selection with optional end dates
- **Interactive Calendar Preview**: Visual representation of all recurring dates
- **Real-time Updates**: Instant preview of changes

### Technical Highlights
- **Modern Architecture**: Clean, modular component design with proper separation of concerns
- **State Management**: Efficient state management using Zustand
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Responsive Design**: Optimized for all device sizes with Tailwind CSS
- **Testing**: Comprehensive test suite with unit and integration tests
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Component Architecture

### Core Components

1. **RecurringDatePicker**: Main container component
2. **RecurrenceOptions**: Handles recurrence type selection and customization
3. **DateRangePicker**: Manages start and end date selection
4. **CalendarPreview**: Interactive calendar showing recurring dates
5. **RecurrenceRuleDisplay**: Shows human-readable summary and statistics

### State Management

The application uses Zustand for state management with a centralized store that handles:
- Recurrence rule configuration
- Date generation and preview
- Human-readable rule formatting

### Utilities

- **dateUtils.ts**: Core date calculation logic
- **types.ts**: TypeScript type definitions
- **store.ts**: Zustand store implementation

## 🎯 Usage Examples

### Basic Daily Recurrence
```typescript
const rule: RecurrenceRule = {
  type: 'daily',
  interval: 1,
  startDate: new Date(),
};
```

### Weekly with Specific Days
```typescript
const rule: RecurrenceRule = {
  type: 'weekly',
  interval: 2,
  startDate: new Date(),
  selectedDays: ['monday', 'wednesday', 'friday'],
};
```

### Monthly Pattern (2nd Tuesday)
```typescript
const rule: RecurrenceRule = {
  type: 'monthly',
  interval: 1,
  startDate: new Date(),
  monthlyPattern: 'day',
  monthlyWeekNumber: 2,
  monthlyDayOfWeek: 'tuesday',
};
```

## 🎨 Design System

The component follows a consistent design system with:
- **Color Palette**: Professional blue and neutral tones
- **Typography**: Inter font family with clear hierarchy
- **Spacing**: 8px grid system for consistent alignment
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG 2.1 compliant color contrast ratios

## 🔧 Customization

The component is highly customizable through:
- **Theme Variables**: CSS custom properties for easy theming
- **Component Props**: Extensible interface for additional functionality
- **Utility Functions**: Reusable date calculation logic
- **Store Configuration**: Flexible state management patterns

## 📊 Performance

- **Bundle Size**: Optimized with tree-shaking
- **Rendering**: Efficient re-renders with proper React patterns
- **Memory Usage**: Minimal memory footprint with date caching
- **Loading**: Fast initial load with code splitting

## 🧩 Extensibility

The architecture supports easy extensions:
- **Custom Patterns**: Add new recurrence types
- **Date Ranges**: Extend date calculation logic
- **UI Components**: Integrate with different design systems
- **Data Persistence**: Add backend integration

## 🔍 Testing Strategy

- **Unit Tests**: Individual function and component testing
- **Integration Tests**: Full component interaction testing
- **Edge Cases**: Boundary conditions and error scenarios
- **Accessibility Tests**: Screen reader and keyboard navigation

## 📝 Documentation

Each component and utility function includes comprehensive JSDoc comments explaining:
- Purpose and functionality
- Parameter descriptions
- Return value information
- Usage examples
- Edge cases and limitations

## 🚦 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- shadcn/ui for the excellent component library
- date-fns for robust date utilities
- The React and Next.js teams for the amazing frameworks