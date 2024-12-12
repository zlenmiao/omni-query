# Changelog

## [Unreleased]

### Added
- Basic website framework setup
  - Created Header component with navigation links
  - Created Footer component with copyright and links
  - Updated root layout to include header and footer
  - Added responsive design with Tailwind CSS

- AI Search functionality
  - Implemented AI search service with DeepSeek API integration
  - Created Search component with real-time results
  - Added error handling and loading states
  - Structured search results display
  - Configuration setup for AI parameters

- Unit Tests
  - Added Jest and Testing Library setup
  - Created comprehensive test suite for AI service
  - Added component tests for Search functionality
  - Added component tests for Markdown rendering
  - Implemented test coverage reporting
  - Added continuous testing workflow

- Internationalization Support
  - Added next-intl for i18n management
  - Implemented language switching (Chinese/English)
  - Created message files for translations
  - Added language-specific search results
  - Updated UI components with translations
  - Added language selection in header
  - Implemented fallback language handling
  - Added i18n middleware configuration

### Enhanced
- Search Component UI/UX
  - Added input validation with real-time feedback
  - Improved loading state with animated spinner
  - Enhanced result cards with modern design
  - Added numbered feature list
  - Improved error message display
  - Added character limit validation
  - Optimized mobile responsiveness
  - Added copy functionality
    - Copy as plain text
    - Copy as Markdown format
    - Visual feedback for copy actions
    - Error handling for clipboard operations

- Markdown Integration
  - Added markdown-it for content rendering
  - Integrated syntax highlighting with highlight.js
  - Created reusable Markdown component
  - Enhanced typography with Tailwind Typography
  - Improved content structure and readability
  - Added custom styling for markdown elements

- AI Search Quality
  - Enhanced search prompt for more detailed results
  - Added support for latest information sourcing
  - Improved result structure with clearer sections
  - Added citation and source references
  - Optimized token usage (4096 max)
  - Reduced temperature for more focused results
  - Added timeline-based information organization
  - Enhanced error handling and fallback strategies