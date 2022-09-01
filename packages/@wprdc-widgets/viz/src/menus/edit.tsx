import * as React from 'react';

import { IndicatorWithData } from '@wprdc-types/profiles';
import { Checkbox, CheckboxGroup } from '@wprdc-components/checkbox-group';

interface EditMenuProps {
  indicator: IndicatorWithData;
  selectedTimeParts: string[];
  selectedVariables: string[];

  onTimePartChange: (selection: string[]) => void;
  onVariableChange: (selection: string[]) => void;
}

export const EditMenu: React.FC<EditMenuProps> = ({
                                                    indicator,
                                                    onTimePartChange,
                                                    onVariableChange,
                                                    selectedTimeParts,
                                                    selectedVariables,
                                                  }) => {
  function handleTimeChange(selectedTimeParts: string[]) {
    onTimePartChange(selectedTimeParts);
  }

  function handleVariableChange(selectedVariables: string[]) {
    onVariableChange(selectedVariables);
  }

  return (
    <div>
      <div>
        <CheckboxGroup
          label='Show/Hide Time Points'
          onChange={handleTimeChange}
          value={selectedTimeParts}
        >
          {indicator.timeAxis.timeParts.map(timePart => (
            <Checkbox value={timePart.slug}>{timePart.name}</Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div>
        <CheckboxGroup
          label='Show/Hide Variables'
          onChange={handleVariableChange}
          value={selectedVariables}
        >
          {indicator.variables.map(variable => (
            <Checkbox value={variable.slug}>{variable.name}</Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
};
