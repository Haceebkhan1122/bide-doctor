function getAppointmentTypeText(appointmentType) {
  if(appointmentType === "instant-consultation") {
    return "Instant Consultation";
  }

  else if(appointmentType === "schedule") {
    return "Video Consultation"
  }

  else if(appointmentType === "in-person") {
    return "Clinic Visit"
  }

  else {
    return "Invalid"
  }
}

export default getAppointmentTypeText;