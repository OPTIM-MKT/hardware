import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";
import {
  contactSchema,
  getLabelByValue,
  PRESUPUESTO_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/components/contact/contact.schema";
import { EmailTemplate } from "@/components/contact/email-template";
import { renderToString } from "react-dom/server";
import React from "react";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM_ADDRESS =
  import.meta.env.RESEND_FROM ?? "Homii Privacidad <onboarding@resend.dev>";
const TO_ADDRESS =
  import.meta.env.RESEND_TO ?? "socialmedia@optimmkt.com";

export const server = {
  send: defineAction({
    accept: "json",
    input: contactSchema,
    handler: async (data) => {
      const presupuestoLabel =
        data.modo === "proyecto"
          ? getLabelByValue(PRESUPUESTO_OPTIONS, data.presupuesto)
          : undefined;
      const timelineLabel =
        data.modo === "proyecto"
          ? getLabelByValue(TIMELINE_OPTIONS, data.timeline)
          : undefined;

      const html = renderToString(
        React.createElement(EmailTemplate, {
          data,
          presupuestoLabel,
          timelineLabel,
        })
      );

      const subject =
        data.modo === "productos"
          ? `Cotización · ${data.items.length} producto${data.items.length === 1 ? "" : "s"} — ${data.nombre}`
          : `Proyecto · ${data.nombre} (${presupuestoLabel ?? "presupuesto por definir"})`;

      const { data: resendData, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        replyTo: data.email,
        subject,
        html,
      });

      if (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return { success: true, id: resendData?.id };
    },
  }),
};
