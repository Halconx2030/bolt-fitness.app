import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseFilters } from './ExerciseFilters';

// Mock de componentes UI
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onChange }: SelectProps) => (
    <select value={value} onChange={onChange}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value}>{children}</option>
  ),
}));

describe('ExerciseFilters', () => {
  interface FilterOptions {
    muscleGroup: string;
    difficulty: string;
    equipment: string;
    searchTerm: string;
  }

  const mockFilters: FilterOptions = {
    muscleGroup: 'all',
    difficulty: 'all',
    equipment: 'all',
    searchTerm: '',
  };

  const mockOptions = {
    muscleGroups: ['Pecho', 'Espalda', 'Piernas', 'Brazos'],
    difficulties: ['Principiante', 'Intermedio', 'Avanzado'],
    equipment: ['Barra', 'Mancuernas', 'Peso corporal', 'Máquina'],
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos los filtros correctamente', () => {
    render(
      <ExerciseFilters
        filters={mockFilters}
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByPlaceholderText(/buscar ejercicios/i)).toBeInTheDocument();
    expect(screen.getByText(/grupo muscular/i)).toBeInTheDocument();
    expect(screen.getByText(/dificultad/i)).toBeInTheDocument();
    expect(screen.getByText(/equipamiento/i)).toBeInTheDocument();
  });

  it('maneja cambios en la búsqueda', async () => {
    render(
      <ExerciseFilters
        filters={mockFilters}
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/buscar ejercicios/i);
    await userEvent.type(searchInput, 'press');

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      searchTerm: 'press',
    });
  });

  it('maneja selección de grupo muscular', async () => {
    render(
      <ExerciseFilters
        filters={mockFilters}
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    const select = screen.getByLabelText(/grupo muscular/i);
    await userEvent.selectOptions(select, 'Pecho');

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      muscleGroup: 'Pecho',
    });
  });

  it('muestra los filtros activos', () => {
    const activeFilters = {
      ...mockFilters,
      muscleGroup: 'Pecho',
      difficulty: 'Intermedio',
    };

    render(
      <ExerciseFilters
        filters={activeFilters}
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    const muscleSelect = screen.getByLabelText(/grupo muscular/i) as HTMLSelectElement;
    const difficultySelect = screen.getByLabelText(/dificultad/i) as HTMLSelectElement;

    expect(muscleSelect.value).toBe('Pecho');
    expect(difficultySelect.value).toBe('Intermedio');
  });

  it('maneja el reseteo de filtros', async () => {
    const activeFilters = {
      ...mockFilters,
      muscleGroup: 'Pecho',
      difficulty: 'Intermedio',
    };

    render(
      <ExerciseFilters
        filters={activeFilters}
        options={mockOptions}
        onFilterChange={mockOnFilterChange}
      />
    );

    const resetButton = screen.getByRole('button', { name: /limpiar filtros/i });
    await userEvent.click(resetButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(mockFilters);
  });
});
