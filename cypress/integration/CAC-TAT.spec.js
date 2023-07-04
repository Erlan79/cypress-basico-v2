/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    beforeEach(function () { /// BLOCO QUE EXECUTA O COMANDO ANTES DE CADA TESTE - EXERCICIO 1
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.'

        cy.get('#firstName').type('Erlã')
        cy.get('#lastName').type('Lima')
        cy.get('#email').type('erla.lima@gmail.com')
        cy.get('#phone').type('71999999999')
        cy.get('select').select(2)
        cy.get('input[type="radio"][value="ajuda"]').check()
        cy.get('#phone-checkbox').click()


        cy.get('#open-text-area').type(longText, { delay: 0 })
        //cy.get('.button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.get('#firstName').type('Erlã')
        cy.get('#lastName').type('Lima')
        cy.get('#email').type('erla.lima@,com')
        cy.get('#phone').type('71999999999')
        cy.get('select').select('Blog')
        cy.get('input[type="radio"][value="elogio"]').check()
        cy.get('#email-checkbox').click()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', function () {
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Erlã')
        cy.get('#lastName').type('Lima')
        cy.get('#email').type('erla.lima@trinks.com')
        cy.get('select').select('youtube')
        cy.get('input[type="radio"][value="feedback"]').check()
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })
   // #region Preenche e limpa os campos
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Erlã')
            .should('have.value', 'Erlã')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Lima')
            .should('have.value', 'Lima')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('erla.lima@trinks.com')
            .should('have.value', 'erla.lima@trinks.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('71999999999')
            .should('have.value', '71999999999')
            .clear()
            .should('have.value', '')
    })
    //#endregion

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })
/// REFATORANDO O CÓDIGO USANDO COMANDO CUSTOMIZADO
    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })
/// SELECIONANDO OPÇÕES EM CAMPOS DE SELEÇÃO SUSPENSA
    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                //console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um dra-and-drop', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'}) // Simulação que arrasta o arquivo
        .should(function ($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        }) 
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
          .selectFile('@sampleFile')
          .should(function ($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank') // Abre página em outra aba
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') // abre página na mesma aba
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    })

})
