# Figma MCP Integration Guide

This project is connected with the Figma MCP toolset:
- `get_design_context`: Retrieve node layouts, components, variants, and colors directly from Figma URLs.
- `get_screenshot`: Capture visual frames for comparison against live code.
- `get_variable_defs`: Extract design tokens (colors, radii, spacing, typography) from Figma files.
- `get_code_connect_map`: Synchronize code components with Figma library components.

When designing or updating screens in Figma:
1. Use consistent token names matching Tailwind CSS utility tokens.
2. Bind components to auto-layout frames with explicit flex direction, gap, and padding.
