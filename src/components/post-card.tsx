'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Github,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import type { PostItem } from '@/store/posts';
import { cn } from '@/lib/utils';

type Props = {
  item: PostItem;
  className?: string;
};

export function PostCard({ item, className }: Props) {
  const socials = [
    { icon: Github, href: item.github },
    { icon: Twitter, href: item.twitter },
    { icon: Facebook, href: item.facebook },
    { icon: Linkedin, href: item.linkedin },
    { icon: Instagram, href: item.instagram },
  ].filter((s) => !!s.href);

  return (
    <Card
      className={cn(
        'group bg-card text-card-foreground border-border hover:border-foreground/20 transition-colors cursor-pointer h-full flex flex-col',
        className
      )}
      role="link"
      tabIndex={0}
      aria-label={`Open ${item.name}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button')) return;
        if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="shrink-0">
          <Avatar className="size-14 rounded-md border border-border bg-muted">
            {item.thumbnail ? (
              <AvatarImage src={item.thumbnail!} alt={item.name} />
            ) : (
              <AvatarFallback>
                {item.name?.[0]?.toUpperCase() ?? 'P'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <Label className="flex-1 min-w-0 truncate text-base font-semibold transition-colors group-hover:text-primary">
              {item.name}
            </Label>
            {item.website ? (
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="hover:bg-transparent opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity [&_svg]:text-muted-foreground hover:[&_svg]:text-primary"
                aria-label="Open Website"
             >
                <a href={item.website!} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground min-h-[2.5rem]">
            {item.tagline}
          </p>
        </div>
      </CardHeader>
      <CardContent className="mt-auto pt-2 flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
        <div className="flex items-center gap-2">
          {socials.map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href!}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
              aria-label="social-link"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
