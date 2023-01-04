import nodemailer from 'nodemailer';
let AWS = require('aws-sdk');

/**
 * @description Helper for creating Nodemailer transport
 */
export const createTransport = (nodemailerUser: string, nodemailerPass: string) =>
  nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01'
    })
  });

/**
 * @description Helper for creating Nodemailer message object
 */
export const createNodemailerData = (
  recipientName: string,
  recipientEmail: string,
  subject: string,
  text: string,
  html: string
) => {
  const senderName = 'ACME Corp. Potted Plants';
  const senderEmail = 'typrone1@gmail.com';

  return {
    from: `${senderName} <${senderEmail}>`,
    to: `${recipientName} <${recipientEmail}>`,
    subject,
    text,
    html
  };
};
