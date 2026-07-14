import { XIcon } from '../assets/icons';
import { AdminDisciplina } from '../services/admin.service';

interface AdminAlunosModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplina: AdminDisciplina | null;
}

export default function AdminAlunosModal({ isOpen, onClose, disciplina }: AdminAlunosModalProps) {
  if (!isOpen || !disciplina) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-[#1A1929] border border-[#2A2940] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2A2940]">
          <div>
            <h2 className="text-xl font-bold text-white">
              Alunos Inscritos
            </h2>
            <p className="text-sm text-[#B0ADC0] mt-1">
              {disciplina.codigo} - {disciplina.nome}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9794A8] hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {disciplina.inscritos && disciplina.inscritos.length > 0 ? (
            <div className="border border-[#2A2940] rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#12111E]/50 border-b border-[#2A2940] text-xs uppercase tracking-wider text-[#9794A8]">
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">RA</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2940]">
                  {disciplina.inscritos.map(aluno => (
                    <tr key={aluno.id} className="hover:bg-[#201F31] transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-white">{aluno.nome}</td>
                      <td className="px-4 py-3 text-sm text-[#B0ADC0]">{aluno.ra}</td>
                      <td className="px-4 py-3 text-sm text-[#9794A8] truncate max-w-[200px]" title={aluno.email}>{aluno.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-[#9794A8] border border-dashed border-[#2A2940] rounded-lg bg-[#12111E]">
              Nenhum aluno inscrito nesta disciplina.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2940] flex justify-between items-center bg-[#161524]">
          <span className="text-sm font-medium text-[#B0ADC0]">
            Total: {disciplina.inscritos?.length || 0} de {disciplina.vagas} vagas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2A2940] hover:bg-[#34334A] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
