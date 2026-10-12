# Changelog

All notable changes to `@flippo/internal-test-utils` will be documented in this file.

## [1.0.0] - 2024-12-XX

### Added
- Initial release of @flippo/internal-test-utils
- `createRenderer` - Standardized renderer for headless components
- `HeadlessTestUtils` - Specialized utilities for headless UI testing
- `AccessibilityTestRunner` - Comprehensive a11y testing
- `PerformanceTestRunner` - Component performance monitoring
- `EventTestRunner` - Advanced event testing capabilities
- Custom Vitest matchers for headless components:
  - `toHaveHeadlessUIAttributes`
  - `toHaveHeadlessFocus`
  - `toHaveCompoundParts`
  - `toHaveEventHandler`
  - `toPreventHeadlessUIHandler`
  - `toBeProperlyPositioned`
- Support for compound component testing patterns
- RTL/LTR testing support
- Performance monitoring and thresholds
- Debug mode with enhanced logging
- Quick setup configurations for different testing scenarios
- Comprehensive TypeScript types
- Integration with Vitest test runner
- Examples and documentation

### Features
- **Compound Component Support**: Testing utilities designed for components that follow the compound pattern (Root, Trigger, Popup, etc.)
- **HeadlessUI Event System**: Support for testing the custom event prevention system
- **Floating UI Integration**: Special handling for components using @floating-ui
- **Performance Monitoring**: Built-in performance tracking and threshold validation
- **Accessibility Testing**: Automated a11y checks with ARIA validation
- **Cross-Browser Compatibility**: Mocking and polyfills for consistent testing
- **Debug Tools**: Enhanced debugging capabilities with DOM inspection
- **TypeScript First**: Full TypeScript support with comprehensive types

### Documentation
- Complete API documentation
- Real-world usage examples
- Migration guide from @testing-library/react
- Best practices for headless component testing
- Troubleshooting guide
