import { useState, useEffect } from 'react';
import { XIcon, PlusIcon, TrashIcon } from '../assets/icons';
import { AdminDisciplina } from '../services/admin.service';

interface AdminDisciplinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: any) => Promise<void>;
  disciplinaInicial?: AdminDisciplina | null;
  todasDisciplinas: AdminDisciplina[];
}

export default function AdminDisciplinaModal({
  isOpen,
  onClose,
  onSave,
  disciplinaInicial,
  todasDisciplinas
}: AdminDisciplinaModalProps) {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    professor: '',
    creditos: 4,
    vagas: 40,
    horarios: [] as { diaSemana: string; horarioInicio: string; horarioFim: string }[],
    departamento: '',
    periodoIdeal: 1,
    preRequisitoId: ''
  });
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (disciplinaInicial) {
      setFormData({
        codigo: disciplinaInicial.codigo || '',
        nome: disciplinaInicial.nome || '',
        descricao: disciplinaInicial.descricao || '',
        professor: disciplinaInicial.professor || '',
        creditos: disciplinaInicial.creditos || 4,
        vagas: disciplinaInicial.vagas || 40,
        horarios: disciplinaInicial.horarios || [],
        departamento: disciplinaInicial.departamento || '',
        periodoIdeal: disciplinaInicial.periodoIdeal || 1,
        preRequisitoId: disciplinaInicial.preRequisito?.id || ''
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        professor: '',
        creditos: 4,
        vagas: 40,
        horarios: [],
        departamento: '',
        periodoIdeal: 1,
        preRequisitoId: ''
      });
    }
    setErro('');
  }, [disciplinaInicial, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleHorarioChange = (index: number, field: string, value: string) => {
    const newHorarios = [...formData.horarios];
    newHorarios[index] = { ...newHorarios[index], [field]: value };
    setFormData(prev => ({ ...prev, horarios: newHorarios }));
  };

  const addHorario = () => {
    setFormData(prev => ({
      ...prev,
      horarios: [...prev.horarios, { diaSemana: 'Segunda', horarioInicio: '08:00', horarioFim: '10:00' }]
    }));
  };

  const removeHorario = (index: number) => {
    const newHorarios = [...formData.horarios];
    newHorarios.splice(index, 1);
    setFormData(prev => ({ ...prev, horarios: newHorarios }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    
    try {
      const dataToSave = { ...formData };
      
      // Clean up empty strings for optional fields
      if (!dataToSave.descricao) delete (dataToSave as any).descricao;
      if (!dataToSave.professor) delete (dataToSave as any).professor;
      if (!dataToSave.departamento) delete (dataToSave as any).departamento;
      if (!dataToSave.periodoIdeal) delete (dataToSave as any).periodoIdeal;
      if (!dataToSave.preRequisitoId) {
          delete (dataToSave as any).preRequisitoId;
          if (disciplinaInicial) {
              (dataToSave as any).preRequisitoId = null; // explicit null to remove it on update
          }
      }

      if (dataToSave.horarios.length === 0) {
        setErro('Adicione ao menos um horário para a disciplina.');
        setCarregando(false);
        return;
      }

      await onSave(dataToSave);
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      setErro(Array.isArray(msg) ? msg.join('\\n') : msg || 'Erro ao salvar disciplina');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-[#1A1929] border border-[#2A2940] rounded-xl drop-shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2A2940]">
          <h2 className="text-xl font-bold text-white">
            {disciplinaInicial ? 'Editar Disciplina' : 'Nova Disciplina'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#9794A8] hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 overflow-y-auto">
          <form id="disciplina-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {erro && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 whitespace-pre-line">
                {erro}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Código *</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                  disabled={!!disciplinaInicial}
                  placeholder="Ex: BCC099"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none disabled:opacity-50"
                />
              </div>

              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Algoritmos I"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#B0ADC0]">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Ementa da disciplina..."
                className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Professor */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Professor</label>
                <input
                  type="text"
                  name="professor"
                  value={formData.professor}
                  onChange={handleChange}
                  placeholder="Nome do professor"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                />
              </div>

              {/* Departamento */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Departamento</label>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  placeholder="Ex: DC"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Créditos */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Créditos *</label>
                <input
                  type="number"
                  name="creditos"
                  value={formData.creditos}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                />
              </div>

              {/* Vagas */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Vagas *</label>
                <input
                  type="number"
                  name="vagas"
                  value={formData.vagas}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                />
              </div>

              {/* Período Ideal */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Semestre Ideal</label>
                <input
                  type="number"
                  name="periodoIdeal"
                  value={formData.periodoIdeal}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pré Requisito */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Pré-Requisito</label>
                <select
                  name="preRequisitoId"
                  value={formData.preRequisitoId}
                  onChange={handleChange}
                  className="w-full border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none appearance-none"
                >
                  <option value="">Nenhum</option>
                  {todasDisciplinas
                    .filter(d => d.id !== disciplinaInicial?.id)
                    .map(d => (
                      <option key={d.id} value={d.id}>
                        {d.codigo} - {d.nome}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Horários Dinâmicos */}
            <div className="flex flex-col gap-3 mt-2 border-t border-[#2A2940] pt-4">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-medium text-[#B0ADC0]">Horários da Disciplina *</label>
                <button
                  type="button"
                  onClick={addHorario}
                  className="text-xs font-semibold flex items-center gap-1 text-brand-primary hover:text-brand-accent transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>

              {formData.horarios.length === 0 && (
                <div className="text-sm text-[#9794A8] bg-[#12111E] p-4 rounded-lg text-center border border-[#2A2940] border-dashed">
                  Nenhum horário definido. Adicione pelo menos um.
                </div>
              )}

              {formData.horarios.map((h, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={h.diaSemana}
                    onChange={(e) => handleHorarioChange(index, 'diaSemana', e.target.value)}
                    className="flex-1 border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                  >
                    <option value="Segunda">Segunda</option>
                    <option value="Terça">Terça</option>
                    <option value="Quarta">Quarta</option>
                    <option value="Quinta">Quinta</option>
                    <option value="Sexta">Sexta</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                  <input
                    type="time"
                    value={h.horarioInicio}
                    onChange={(e) => handleHorarioChange(index, 'horarioInicio', e.target.value)}
                    className="w-[110px] border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                  />
                  <span className="text-[#9794A8]">às</span>
                  <input
                    type="time"
                    value={h.horarioFim}
                    onChange={(e) => handleHorarioChange(index, 'horarioFim', e.target.value)}
                    className="w-[110px] border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] text-white text-sm focus:border-brand-primary/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeHorario(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#2A2940] flex justify-end gap-3 bg-[#161524]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#B0ADC0] hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            form="disciplina-form"
            type="submit"
            disabled={carregando}
            className="px-4 py-2 bg-brand-primary hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {carregando ? 'Salvando...' : 'Salvar Disciplina'}
          </button>
        </div>

      </div>
    </div>
  );
}
