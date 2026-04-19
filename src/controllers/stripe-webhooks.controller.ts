import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  Request,
  RestBindings,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {ApplicationRepository} from '../repositories';
import {APPLICATION_FEE_STATUS_ENUM} from '../schema';
import {SmtpMailService, StripeService} from '../services';

export class StripeWebhooksController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,

    @service(StripeService)
    private stripeService: StripeService,

    @inject(RestBindings.Http.REQUEST) private request: Request,

    @service(SmtpMailService)
    private mailService: SmtpMailService,
  ) {}

  @post('/stripe-events')
  @response(200, {
    description: 'Webhooks for handling stripe events',
    content: {
      'application/json': {schema: {type: 'boolean'}},
    },
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          'x-parser': 'raw',
          schema: {type: 'object'},
        },
      },
    })
    body: Buffer,
  ): Promise<Boolean> {
    const sig = this.request.headers['stripe-signature'];
    const event = await this.stripeService.verifyWebhookEvent(body, sig);
    console.log('verifywebhook', event);
    if (event && event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const metadata = invoice.metadata;
      let applicationPaymentDate = new Date(invoice.created * 1000);
      if (metadata && metadata.applicationId) {
        await this.applicationRepository.updateById(metadata.applicationId, {
          applicationFeePaymentStatus: APPLICATION_FEE_STATUS_ENUM.PAID,
          applicationFeeInvoiceId: invoice.id,
          applicationFeeInvoiceDownloadUrl: invoice.invoice_pdf,
          applicationFee: invoice.amount_paid / 100,
          applicationPaymentDate,
        });

        this.mailService.sendApplicationFeePaymentInvoice(
          invoice.customer_email,
          invoice.customer_name,
          invoice.amount_paid / 100,
          invoice.currency,
          metadata.applicationId,
          metadata.courseName,
          metadata.universityName,
          invoice.invoice_pdf,
        );
      }
    }
    return true;
  }
}
