"use client";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<typeof ArrowLeft>;

export const NavArrowLeft = (props: IconProps) => <ArrowLeft {...props} />;
export const NavArrowRight = (props: IconProps) => <ArrowRight {...props} />;