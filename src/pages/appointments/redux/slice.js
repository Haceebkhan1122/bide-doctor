import {
  createSlice,
  current,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import {
  getDiseases,
  getAppointmentDetails,
  getAppointmentData,
  getVitalScan,
  getMedicine,
  getInsulin,
  getLab,
  getMedicalRecord,
  postConsult,
  getAppointmentToken,
  getAppDetail,
  getInstantMedicalRecord
} from "./thunk";

const thunks = [
  getDiseases,
  getAppointmentDetails,
  getAppointmentData,
  getVitalScan,
  getMedicine,
  getInsulin,
  getLab,
  getMedicalRecord,
  getInstantMedicalRecord,
  postConsult,
  getAppointmentToken,
  getAppDetail
];

const initialState = {
  status: "idle",
  Diseases: {},
  Appointment: {},
  AppointmentData: {},
  VitalScan: {},
  Medicine: {},
  Insulin: {},
  Labs: {},
  MedicalRecord: {},
  InstantMedicalRecord: {},
  Consultation: {},
  AppointmentToken: {},
  AppDetail: {},
  appointmentSuccess: false,
  isLoading: false,
  isMedicineLoading: false,
  appointmentDataSuccess: false,
  isLabLoading: false,
  diseasesLoading: false
};

export const slice = createSlice({
  name: "appointmentRecord",
  initialState,
  reducers: {
    // setClinic: (state, clinic) => {
    //   // state.clinic_rec = clinic.payload
    //   state.Clinics = {...state.Clinics, ...clinic.payload}
    //   // console.log(state.Clinics)
    // }
    //   setBank: (state, bank) => {
    //     state.userBank = bank.payload
    //   }
    // setConsult: (state, data) => {
    //   // console.log(data)
    //   state.Consultation = data.payload
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDiseases.pending, (state, action) => {
        state.diseasesLoading = true;
      })
      .addCase(getDiseases.fulfilled, (state, action) => {
        state.status = "idle";
        state.Diseases = action.payload;
        state.diseasesLoading = false;
      })
      .addCase(getAppointmentDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAppointmentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "idle";
        state.Appointment = action.payload;
      })
      .addCase(getAppointmentData.fulfilled, (state, action) => {
        state.status = "idle";
        state.AppointmentData = action.payload;
        state.appointmentDataSuccess = true;
      })
      .addCase(getVitalScan.fulfilled, (state, action) => {
        state.status = "idle";
        state.VitalScan = action.payload;
      })
      .addCase(getMedicine.pending, (state, action) => {
        state.isMedicineLoading = true;
      })
      .addCase(getMedicine.fulfilled, (state, action) => {
        state.status = "idle";
        state.isMedicineLoading = false;
        state.Medicine = action.payload;
      })
      .addCase(getInsulin.pending, (state, action) => {
        state.isMedicineLoading = true;
      })
      .addCase(getInsulin.fulfilled, (state, action) => {
        state.status = "idle";
        state.isMedicineLoading = false;
        state.Insulin = action.payload;
      })
      .addCase(getLab.pending, (state, action) => {
        state.isLabLoading = true;
      })
      .addCase(getLab.fulfilled, (state, action) => {
        state.status = "idle";
        state.Labs = action.payload;
        state.isLabLoading = false;
      })
      .addCase(getMedicalRecord.fulfilled, (state, action) => {
        state.status = "idle";
        state.MedicalRecord = action.payload;
      })
      .addCase(getInstantMedicalRecord.fulfilled, (state, action) => {
        state.status = "idle";
        state.InstantMedicalRecord = action.payload;
      })

      .addCase(postConsult.fulfilled, (state, action) => {
        state.status = "idle";
        state.Consultation = action.payload;
      })
      .addCase(getAppointmentToken.fulfilled, (state, action) => {
        state.status = "idle";
        state.AppointmentToken = action.payload;
      })
      .addCase(getAppDetail.fulfilled, (state, action) => {
        state.status = "idle";
        state.AppDetail = action.payload;
      })

      .addMatcher(isPending(...thunks), (state) => {
        state.status = "pending";
      })
      .addMatcher(isFulfilled(postConsult, getAppointmentToken), (state) => {
        state.status = "fulfilled";
        state.appointmentSuccess = true;

      })
      .addMatcher(isRejected(...thunks), (state, action) => {
        state.status = "rejected";
        state.error = action.error;
      });
  },
});

// export const { setClinic } = slice.actions;

// export const { setConsult } = slice.actions;

export const selectDiseases = (state) => state.appointment.Diseases;
// export const selectClinics = (state) => state.clinic.Clinics;
// export const getClinic = (state) => state.clinic.clinics;

//   export const selectEmail = (state) => state.login.userEmail;

export const selectAppointment = (state) => state.appointment.Appointment;
export const selectAddDetail = (state) => state.appointment.AppDetail;
export const selectAppDetailLoader = (state) => state.appointment.status;
export const selectAppointmentData = (state) => state.appointment.AppointmentData;
export const selectVitalScan = (state) => state.appointment.VitalScan;
export const selectMedicine = (state) => state.appointment.Medicine;
export const selectInsulin = (state) => state.appointment.Insulin;
export const selectLabs = (state) => state.appointment.Labs;
export const selectMedical = (state) => state.appointment.MedicalRecord;
export const selectInstantMedical = (state) => state.appointment.InstantMedicalRecord;
export const selectConsult = (state) => state.appointment.Consultation;
export const selectAppointmentToken = (state) => state.appointment.AppointmentToken;
export const selectAppointmentDataSuccess = (state) => state.appointment.appointmentDataSuccess;
export const selectMedicineLoading = (state) => state.appointment.isMedicineLoading;
export const selectLabLoading = (state) => state.appointment.isLabLoading;
export const selectDiseasesLoading = (state) => state.appointment.diseasesLoading;

export default slice.reducer;

