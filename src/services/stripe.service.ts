import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Application, Courses} from '../models';
import {Roles, StudentProfile, UniversityProfile, User} from '../schema';
const stripe = require('stripe')(process.env.STRIPE_KEY);

const AGENT_WEB_URL =
  process.env.AGENT_WEB_PORTAL_BASE_URL ?? 'https://eduapply-agent.doerz.dev/';
const STUDENT_WEB_URL =
  process.env.STUDENT_WEB_PORTAL_BASE_URL ??
  'https://eduapply-student.doerz.dev/';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

@injectable({scope: BindingScope.TRANSIENT})
export class StripeService {
  constructor(/* Add @inject to inject parameters */) {}

  async addApplicationFeeAsProduct(
    university: UniversityProfile,
    course: Courses,
  ) {
    const courseProduct = await stripe.products.create({
      name: `Application Fee for ${course.title} at ${university.name}`,
      default_price_data: {
        currency: university.currency ?? 'usd',
        unit_amount: course.applicationFee * 100,
      },
      metadata: {
        universityId: university.id,
        courseId: course.id,
      },
    });

    return courseProduct;
  }

  async UpdateApplicationFeeAsProduct(
    university: UniversityProfile,
    course: Courses,
    productId: string,
  ) {
   
    const courseProduct = await stripe.products.update(productId, {
      name: `Application Fee for ${course.title} at ${university.name}`,
    });

    return courseProduct;
  }

  async UpdatePriceObject(
    university: UniversityProfile,
    course: Courses,
    productId: string,
  ) {
    const productPrice = await stripe.prices.create({
      unit_amount: course.applicationFee * 100,
      currency: university?.currency || 'usd',

      product: productId,
    });

    return productPrice;
  }

  async archivePriceObject(priceId: string) {
    const price = await stripe.prices.update(priceId, {
      active: false,
    });
    return price;
  }

  async createApplicationFeeCheckoutSession(
    user: User,
    application: Application,
    course: Courses,
    university: UniversityProfile,
    applicant: StudentProfile,
  ) {
    const redirectBaseUrl =
      user.roleId == Roles.STUDENT ? STUDENT_WEB_URL : AGENT_WEB_URL;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: course.applicationFeeStripeId,
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      customer_email: user.username,
      metadata: {
        eduApplyUserId: user.id,
        eduApplyUserEmail: user.username,
        applicationId: application.id,
        courseId: course.id,
        applicantId: applicant.id,
        courseName: course.title,
        universityId: university.id,
        universityName: university.name,
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: {
            eduApplyUserId: user.id,
            eduApplyUserEmail: user.username,
            applicationId: application.id,
            courseId: course.id,
            applicantId: applicant.id,
            courseName: course.title,
            universityId: university.id,
            universityName: university.name,
          },
        },
      },
      mode: 'payment',
      success_url: `${redirectBaseUrl}/dashboard/MyApplication/Application/?applicationId=${application.id}`,
      cancel_url: `${redirectBaseUrl}/dashboard/MyApplication/Application/?applicationId=${application.id}`,
    });
    return session;
  }

  async verifyWebhookEvent(body: Buffer, sig: any) {
    try {
      let event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
      return event;
    } catch (error) {
      return null;
    }
  }

  async expireCheckoutSession(sessionId: string) {
    await stripe.checkout.sessions.expire(sessionId);
  }
}
