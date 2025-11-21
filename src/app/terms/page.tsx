export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9de3e442-281e-4f62-8b95-cd94a151e2b6.png" 
              alt="IsaLabs Logo" 
              className="h-12 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
            <p className="text-gray-600">Última atualização: Janeiro de 2024</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o IsaLabs, você concorda em cumprir e ficar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
              O IsaLabs é uma plataforma digital que oferece atividades educativas e de desenvolvimento 
              para crianças de 1 a 5 anos, destinada a pais e cuidadores.
            </p>

            <h2>3. Uso Permitido</h2>
            <p>Você pode usar o IsaLabs para:</p>
            <ul>
              <li>Acessar atividades educativas para crianças</li>
              <li>Acompanhar o progresso do desenvolvimento infantil</li>
              <li>Utilizar recursos e materiais educacionais fornecidos</li>
            </ul>

            <h2>4. Restrições de Uso</h2>
            <p>É proibido:</p>
            <ul>
              <li>Usar o serviço para fins comerciais sem autorização</li>
              <li>Reproduzir, distribuir ou modificar o conteúdo sem permissão</li>
              <li>Interferir no funcionamento do serviço</li>
              <li>Usar o serviço de forma que possa prejudicar menores</li>
            </ul>

            <h2>5. Contas de Usuário</h2>
            <p>
              Você é responsável por manter a confidencialidade de sua conta e senha. 
              Você concorda em aceitar a responsabilidade por todas as atividades que ocorrem em sua conta.
            </p>

            <h2>6. Privacidade e Proteção de Dados</h2>
            <p>
              Respeitamos sua privacidade e a de suas crianças. Consulte nossa Política de Privacidade 
              para entender como coletamos, usamos e protegemos suas informações.
            </p>

            <h2>7. Conteúdo do Usuário</h2>
            <p>
              Qualquer conteúdo que você enviar ou criar no IsaLabs permanece de sua propriedade, 
              mas você nos concede uma licença para usar esse conteúdo para fornecer nossos serviços.
            </p>

            <h2>8. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo do IsaLabs, incluindo textos, gráficos, logos, ícones, imagens e software, 
              é propriedade do IsaLabs ou de seus licenciadores e é protegido por leis de direitos autorais.
            </p>

            <h2>9. Limitação de Responsabilidade</h2>
            <p>
              O IsaLabs é fornecido "como está" e "conforme disponível". Não garantimos que o serviço 
              será ininterrupto, seguro ou livre de erros.
            </p>

            <h2>10. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação.
            </p>

            <h2>11. Rescisão</h2>
            <p>
              Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, 
              por qualquer motivo, incluindo violação destes Termos de Uso.
            </p>

            <h2>12. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida 
              nos tribunais competentes do Brasil.
            </p>

            <h2>13. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
              dos canais disponíveis em nosso site.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 IsaLabs. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}