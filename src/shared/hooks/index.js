/**
 * Exportación centralizada de todos los hooks de la aplicación
 */

// Hooks de usuarios (veterinarios y dueños)
export {
  useUsers,
  useUser,
  useVeterinarios,
  useDuenos,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from './useUsers';

// Hooks de mascotas
export {
  usePets,
  usePet,
  usePetsByOwner,
  usePetByQR,
  useCreatePet,
  useUpdatePet,
  useDeletePet,
} from './usePets';

// Hooks de citas
export {
  useAppointments,
  useAppointment,
  useAppointmentsToday,
  useAppointmentsByStatus,
  useAppointmentsByPet,
  useAppointmentsByOwner,
  useAppointmentsByVet,
  useCreateAppointment,
  useUpdateAppointment,
  useConfirmAppointment,
  useCompleteAppointment,
  useCancelAppointment,
  useDeleteAppointment,
} from './useAppointments';

// Hooks de fichas médicas
export {
  useMedicalRecords,
  useMedicalRecord,
  useMedicalRecordsByPet,
  useCreateMedicalRecord,
  useUpdateMedicalRecord,
  useDeleteMedicalRecord,
} from './useMedicalRecords';

// Hooks de estadísticas
export {
  useStatistics,
  useDashboard,
} from './useStatistics';

// Hook de responsive
export { default as useIsMobile } from './useIsMobile';
