import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { InputField } from './InputField';
import React from 'react';

describe('InputField', () => {
    // Verify component renders correctly
    it('Renders with correct input', () => {
        const { container } = render(
            <InputField
                label="Test Label"
                placeholder="Enter text"
                type="text"
                name="testField"
                value="test value"
                required={true}
            />
        );

        // Find elements
        const label = container.querySelector('label');
        const input = container.querySelector('input');

        // Verify label text
        expect(label.textContent).toBe('Test Label*');

        // Verify input attributes
        expect(input.placeholder).toBe('Enter text');
        expect(input.type).toBe('text');
        expect(input.name).toBe('testField');
        expect(input.value).toBe('test value');
        expect(input.required).toBe(true);
    });
});
