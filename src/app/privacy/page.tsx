export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
            <p className="text-gray-600">Última atualização: Janeiro de 2024</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Introdução</h2>
            <p>
              O IsaLabs está comprometido em proteger a privacidade de nossos usuários, especialmente 
              quando se trata de informações sobre crianças. Esta Política de Privacidade explica como 
              coletamos, usamos, armazenamos e protegemos suas informações pessoais.
            </p>

            <h2>2. Informações que Coletamos</h2>
            <h3>2.1 Informações Pessoais</h3>
            <ul>
              <li>Nome e e-mail do responsável</li>
              <li>Nome e data de nascimento da criança</li>
              <li>Interesses e preferências da criança</li>
              <li>Progresso nas atividades</li>
            </ul>

            <h3>2.2 Informações Técnicas</h3>
            <ul>
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Dados de uso da plataforma</li>
              <li>Cookies e tecnologias similares</li>
            </ul>

            <h2>3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul>
              <li>Fornecer atividades personalizadas para a idade da criança</li>
              <li>Acompanhar o progresso de desenvolvimento</li>
              <li>Melhorar nossos serviços e conteúdo</li>
              <li>Comunicar atualizações importantes</li>
              <li>Garantir a segurança da plataforma</li>
            </ul>

            <h2>4. Proteção de Dados de Crianças</h2>
            <p>
              Levamos muito a sério a proteção de dados de crianças. Seguimos as melhores práticas 
              de segurança e cumprimos todas as leis aplicáveis de proteção de dados infantis, 
              incluindo a LGPD (Lei Geral de Proteção de Dados).
            </p>

            <h2>5. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto nas seguintes situações:
            </p>
            <ul>
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Para proteger nossos direitos e segurança</li>
              <li>Com provedores de serviços que nos ajudam a operar a plataforma</li>
            </ul>

            <h2>6. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
              suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2>7. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os 
              propósitos descritos nesta política, a menos que um período de retenção mais longo 
              seja exigido por lei.
            </p>

            <h2>8. Seus Direitos</h2>
            <p>Você tem o direito de:</p>
            <ul>
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Restringir o processamento de seus dados</li>
              <li>Portabilidade de dados</li>
              <li>Retirar o consentimento a qualquer momento</li>
            </ul>

            <h2>9. Cookies</h2>
            <p>
              Usamos cookies para melhorar sua experiência em nossa plataforma. Você pode controlar 
              o uso de cookies através das configurações do seu navegador.
            </p>

            <h2>10. Links para Sites de Terceiros</h2>
            <p>
              Nossa plataforma pode conter links para sites de terceiros. Não somos responsáveis 
              pelas práticas de privacidade desses sites.
            </p>

            <h2>11. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
              sobre mudanças significativas através de e-mail ou aviso em nossa plataforma.
            </p>

            <h2>12. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
              entre em contato conosco:
            </p>
            <ul>
              <li>E-mail: privacidade@isalabs.com</li>
              <li>Através dos canais de suporte em nossa plataforma</li>
            </ul>

            <h2>13. Conformidade com a LGPD</h2>
            <p>
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil. 
              Respeitamos todos os direitos dos titulares de dados conforme estabelecido na legislação.
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