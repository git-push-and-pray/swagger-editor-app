import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ProxyResponse } from '@/types/openapi';

import ResponseDisplay from '../TryItOut/ResponseDisplay';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'responseDisplay.body': 'Body',
      'responseDisplay.headers': 'Headers',
      'responseDisplay.info': 'Info',
      'responseDisplay.status': 'Status:',
      'responseDisplay.duration': 'Duration:',
      'responseDisplay.error': 'Error:',
    };
    return translations[key] || key;
  },
}));

describe('ResponseDisplay', () => {
  const successResponse: ProxyResponse = {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'application/json',
      'content-length': '123',
    },
    body: '{"id":1,"name":"John"}',
    duration: 145,
  };

  const errorResponse: ProxyResponse = {
    status: 404,
    statusText: 'Not Found',
    headers: {},
    body: '{"error":"Resource not found"}',
    duration: 0,
    error: 'Resource not found',
  };

  const textResponse: ProxyResponse = {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'text/plain',
    },
    body: 'Hello, world!',
    duration: 50,
  };

  const emptyResponse: ProxyResponse = {
    status: 204,
    statusText: 'No Content',
    headers: {},
    body: '',
    duration: 30,
  };

  describe('rendering', () => {
    it('should display status code and status text', () => {
      render(<ResponseDisplay response={successResponse} />);

      expect(screen.getByText('200 OK')).toBeInTheDocument();
    });

    it('should display status code in green for success (2xx)', () => {
      render(<ResponseDisplay response={successResponse} />);

      const statusElement = screen.getByText('200 OK');
      expect(statusElement).toHaveClass('text-accentdark');
    });

    it('should display status code in red for error (4xx/5xx)', () => {
      render(<ResponseDisplay response={errorResponse} />);

      const statusElement = screen.getByText('404 Not Found');
      expect(statusElement).toHaveClass('text-errordark');
    });

    it('should display duration in milliseconds', () => {
      render(<ResponseDisplay response={successResponse} />);

      expect(screen.getByText('145ms')).toBeInTheDocument();
    });

    it('should display all three tabs: Body, Headers, Info', () => {
      render(<ResponseDisplay response={successResponse} />);

      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Headers')).toBeInTheDocument();
      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('should have Body tab active by default', () => {
      render(<ResponseDisplay response={successResponse} />);

      const bodyTab = screen.getByText('Body');
      expect(bodyTab).toHaveClass('border-info');
    });
  });

  describe('Body tab', () => {
    it('should display plain text body when not JSON', () => {
      render(<ResponseDisplay response={textResponse} />);

      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJsonResponse: ProxyResponse = {
        ...successResponse,
        body: '{"invalid": json}',
      };

      render(<ResponseDisplay response={invalidJsonResponse} />);

      expect(screen.getByText('{"invalid": json}')).toBeInTheDocument();
    });
  });

  describe('Headers tab', () => {
    it('should display all headers', () => {
      render(<ResponseDisplay response={successResponse} />);

      const headersTab = screen.getByText('Headers');
      fireEvent.click(headersTab);

      expect(screen.getByText('content-type:')).toBeInTheDocument();
      expect(screen.getByText('application/json')).toBeInTheDocument();
      expect(screen.getByText('content-length:')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should show "No headers" message when headers are empty', () => {
      render(<ResponseDisplay response={emptyResponse} />);

      const headersTab = screen.getByText('Headers');
      fireEvent.click(headersTab);

      const headerContainer = screen.getByText('Headers').closest('div')?.nextElementSibling;
      expect(headerContainer).toBeInTheDocument();
    });
  });

  describe('Info tab', () => {
    it('should display status', () => {
      render(<ResponseDisplay response={successResponse} />);

      const infoTab = screen.getByText('Info');
      fireEvent.click(infoTab);

      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should display error details when present', () => {
      render(<ResponseDisplay response={errorResponse} />);

      const infoTab = screen.getByText('Info');
      fireEvent.click(infoTab);

      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText('Resource not found')).toBeInTheDocument();
    });

    it('should not display error section when error is absent', () => {
      render(<ResponseDisplay response={successResponse} />);

      const infoTab = screen.getByText('Info');
      fireEvent.click(infoTab);

      expect(screen.queryByText('Error:')).not.toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('should switch to Headers tab when clicked', () => {
      render(<ResponseDisplay response={successResponse} />);

      const headersTab = screen.getByText('Headers');
      fireEvent.click(headersTab);

      expect(headersTab).toHaveClass('border-info');
      expect(screen.getByText('content-type:')).toBeInTheDocument();
    });

    it('should switch to Info tab when clicked', () => {
      render(<ResponseDisplay response={successResponse} />);

      const infoTab = screen.getByText('Info');
      fireEvent.click(infoTab);

      expect(infoTab).toHaveClass('border-info');
      expect(screen.getByText('Status:')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined headers gracefully', () => {
      const responseWithoutHeaders: ProxyResponse = {
        ...successResponse,
        headers: {},
      };

      render(<ResponseDisplay response={responseWithoutHeaders} />);

      const headersTab = screen.getByText('Headers');
      fireEvent.click(headersTab);

      expect(screen.getByText('Headers')).toBeInTheDocument();
    });
  });
});
