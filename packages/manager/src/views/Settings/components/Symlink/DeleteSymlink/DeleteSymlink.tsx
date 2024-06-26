/* eslint-disable react/jsx-props-no-spreading */
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  TextInput
} from '@patternfly/react-core';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';

const envValidation = /^[a-zA-Z0-9-]+$/;
export const schema = yup.object({
  // TODO: change this to URL validation, after server supports http protocol append
  propertyIdentifier: yup.string().label('Web property').trim(),
  identifier: yup.string().label('Application Name').trim(),
  source: yup.string().label('Source File Path').trim().required(),
  target: yup.string().label('Target File Path').trim().required(),
  env: yup
    .string()
    .label('Environment Name')
    .trim()
    .noWhitespace()
    .max(15)
    .matches(envValidation, 'Only letters, numbers, and dashes are allowed')
    .required()
});

export interface FormData extends yup.InferType<typeof schema> {}

type Props = {
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  propertyIdentifier: string;
  applicationIdentifier: string;
  env: string;
  data: any;
};

export const DeleteSymlink = ({
  onSubmit,
  onClose,
  propertyIdentifier,
  applicationIdentifier,
  env,
  data
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="propertyIdentifier"
            defaultValue={propertyIdentifier}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Web property"
                isRequired
                fieldId="propertyIdentifier"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Add web-property name"
                  type="text"
                  id="propertyIdentifier"
                  {...field}
                  isDisabled
                  value={propertyIdentifier}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="identifier"
            defaultValue={applicationIdentifier}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Application Name"
                isRequired
                fieldId="identifier"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Add application name"
                  type="text"
                  id="identifier"
                  {...field}
                  isDisabled
                  value={applicationIdentifier}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="source"
            defaultValue={data?.source}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Source File Path"
                isRequired
                fieldId="source"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Default Source File Path Name"
                  type="text"
                  id="source"
                  {...field}
                  isDisabled
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="target"
            defaultValue={data?.target}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Target File Path"
                isRequired
                fieldId="target"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Default Target File Path"
                  type="text"
                  id="target"
                  {...field}
                  isDisabled
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <SplitItem isFilled style={{ width: '100%' }}>
        <Controller
          control={control}
          name="env"
          defaultValue={env}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormGroup
              label="Select Environment"
              fieldId="select-env"
              validated={error ? 'error' : 'default'}
              isRequired
              helperTextInvalid={error?.message}
            >
              <FormSelect
                label="Select Environment"
                aria-label="FormSelect Input"
                onChange={(event) => {
                  onChange(event);
                }}
                value={value}
                isDisabled
              >
                <FormSelectOption key={1} label="Please select an environment" isDisabled />
                {webPropertiesKeys.map((envName) => (
                  <FormSelectOption key={envName} value={envName} label={envName} />
                ))}
              </FormSelect>
            </FormGroup>
          )}
        />
      </SplitItem>

      <ActionGroup>
        <Button
          variant="danger"
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isSubmitting || Object.keys(errors).length !== 0}
        >
          Delete
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};
