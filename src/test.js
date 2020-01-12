import { render, getByText } from '@testing-library/react';
import React from 'react';

test('should render', () => {
  const { container } = render(<div>test</div>);
  const component = getByText(container, 'test');

  expect(component).toBeTruthy();
});
