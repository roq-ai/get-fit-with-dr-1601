import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMealPlan } from 'apiSdk/meal-plans';
import { Error } from 'components/error';
import { mealPlanValidationSchema } from 'validationSchema/meal-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { FunctionalNutritionistInterface } from 'interfaces/functional-nutritionist';
import { PatientInterface } from 'interfaces/patient';
import { getFunctionalNutritionists } from 'apiSdk/functional-nutritionists';
import { getPatients } from 'apiSdk/patients';
import { MealPlanInterface } from 'interfaces/meal-plan';

function MealPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MealPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMealPlan(values);
      resetForm();
      router.push('/meal-plans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MealPlanInterface>({
    initialValues: {
      name: '',
      description: '',
      nutritionist_id: (router.query.nutritionist_id as string) ?? null,
      patient_id: (router.query.patient_id as string) ?? null,
    },
    validationSchema: mealPlanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Meal Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<FunctionalNutritionistInterface>
            formik={formik}
            name={'nutritionist_id'}
            label={'Select Functional Nutritionist'}
            placeholder={'Select Functional Nutritionist'}
            fetcher={getFunctionalNutritionists}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<PatientInterface>
            formik={formik}
            name={'patient_id'}
            label={'Select Patient'}
            placeholder={'Select Patient'}
            fetcher={getPatients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'meal_plan',
  operation: AccessOperationEnum.CREATE,
})(MealPlanCreatePage);
